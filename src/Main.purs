module Main where

import Prelude (Unit, discard, map, pure, unit, ($), (*), (+), (-), (/), (>>=))

import Accessors (_colors, _frame, _height, _html_code, _id, _image_colors, _result, _width, _x, _y)
import Data.Array (length, (!!))
import Data.Either (Either(..))
import Data.FunctorWithIndex (mapWithIndex)
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import Data.String (toUpper)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (logShow)
import Fetch (Config(..), Header(..), Method(..), fetch)
import Foreign (Foreign)
import Foreign.Class (encode)
import Optic.Getter ((^.))
import Sketch.Dom as Dom
import Sketch.Settings as Settings
import Sketch.Types (Fill(..), Frame(..), GroupLayer(..), GroupStyle(..), ImageLayer, InputType(..), Layer(..), ShapeLayer(..), ShapeStyle(..))
import Sketch.UI as UI
import Types (ColorsReq(..), ColorsRes) 

foreign import getBase64StrFromLayerID :: String -> String
foreign import newLayer :: String -> Foreign -> Effect Unit

imagePaletteGenerate :: Effect Unit
imagePaletteGenerate = do
  Settings.settingForKey "api-key" >>= case _ of
      Left _ -> setAuthString
      Right (auth_val :: String) -> do
        UI.message "🕒 Generating..."
        Dom.selectedLayers >>= case _ of
          Left err -> UI.message "Unable to fetch layers"
          Right layers -> case length layers, layers !! 0 of
              0,                  _ -> UI.message "Please select an Image Layer..."
              1, Just (Image layer) -> generatePaletteFromLayer auth_val layer  
              1,                  _ -> UI.message "Please select an Image Layer..."
              _,                  _ -> UI.message "More than one layer selected..."
  where
    generatePaletteFromLayer :: String -> ImageLayer -> Effect Unit
    generatePaletteFromLayer auth_val il = do
          let base64Str = getBase64StrFromLayerID $ il ^. _id
          let configPost = Config
                { url: "https://api.imagga.com/v2/colors"
                , method: POST
                , data: ColorsReq { image_base64: base64Str, deterministic: "1" }
                , headers:
                    [ Header "Cache-Control" "no-cache"
                    , Header "cache-control" "no-cache"
                    , Header "Content-Type" "application/json"
                    , Header "Authorization" auth_val
                    ]
                , formData: true
                }
          launchAff_ $ fetch configPost >>= case _ of
              Left err -> logShow err
              Right (dat :: ColorsRes) -> do
                let image = map (\b -> b ^. _html_code) (dat ^. _result ^. _colors ^. _image_colors)
                let width = (il ^. _frame ^. _width) / (toNumber $ length image)
                let colors = mapWithIndex (makeShapeWithColor width) image
                let group = makeGroupWithChildren (il ^. _frame ^. _x) (il ^. _frame ^. _y + il ^. _frame ^. _height - 50.0) colors
                liftEffect do 
                  newLayer (il ^. _id) $ encode group
                  UI.message "🎨 Palette generated..."
    
    makeGroupWithChildren :: Number -> Number -> Array Layer -> Layer
    makeGroupWithChildren x y children = Group $ GroupLayer
        { type: "Group"
        , id: "ID"
        , name: "Palette"
        , frame: Frame { x , y , width: 100.0 , height: 50.0 }
        , hidden: false
        , locked: false
        , style: GroupStyle
            { type: "Style"
            , id: "ID"
            , opacity: 1.0
            , shadows: Just []
            }
        , layers: children
        }
    
    makeShapeWithColor :: Number -> Int -> String -> Layer
    makeShapeWithColor width index color = Shape $ ShapeLayer
        { type: "ShapePath"
        , id: "String"
        , frame: Frame { x: (toNumber index) * width , y: 0.0 , width , height: 50.0 }
        , name: toUpper color
        , hidden: false
        , locked: false
        , style: ShapeStyle
            { type: "Style"
            , id: "ID"
            , opacity: 1.0
            , fills: ( Just
                  [ Fill
                      { fill: "Color"
                      , color: color
                      , gradient: Nothing
                      , enabled: true
                      }
                  ]
              )
            , borders: Just []
            , shadows: Just []
            }
        , shapeType: "Rectangle"
        , points: []
        }


setAuthString :: Effect Unit
setAuthString = let desc = """  If you dont have one then do as following : 
  1. Open www.imagga.com
  2. Sign In / Sign Up and go to Dashboard
  3. Copy the Authorization String
  e.g. Basic ...
  """
  in UI.getInputFromUser "Please paste the Authorization String here" (STRING "" desc (Just 3)) >>= case _ of
      Left _ -> pure unit
      Right (auth_val :: String) -> do
          Settings.setSettingForKey "api-key" auth_val
          UI.message "🔑 Auth String set succesful, now try generating palette..."


