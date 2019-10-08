module Types where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Newtype (class Newtype)
import Fetch (class Fetch, genericFetch)
import Foreign.Class (class Decode, class Encode)
import Foreign.Generic (defaultOptions, genericDecode, genericEncode)

newtype ColorsReq = ColorsReq
  { image_base64 :: String
  , deterministic :: String
  }
derive instance genericColorsReq :: Generic ColorsReq _
instance encodeColorsReq :: Encode ColorsReq where encode = genericEncode (defaultOptions { unwrapSingleConstructors = true })

newtype Result = Result
  { colors :: Colors
  }
derive instance newtypeResult :: Newtype Result _
derive instance genericResult :: Generic Result _
instance decodeResult :: Decode Result where decode = genericDecode (defaultOptions { unwrapSingleConstructors = true })
instance showResult :: Show Result where show = genericShow

newtype Color = Color
  { html_code :: String
  , r :: Int
  , g :: Int
  , b :: Int
  }
derive instance newtypeColor :: Newtype Color _
derive instance genericColor :: Generic Color _
instance decodeColor :: Decode Color where decode = genericDecode (defaultOptions { unwrapSingleConstructors = true })
instance showColor :: Show Color where show = genericShow

newtype Colors = Colors
  { color_percent_threshold :: Number
  , color_variance :: Number
  , object_percentage :: Number
  , background_colors :: Array Color
  , foreground_colors :: Array Color
  , image_colors :: Array Color
  }
derive instance newtypeColors :: Newtype Colors _
derive instance genericColors :: Generic Colors _
instance decodeColors :: Decode Colors where decode = genericDecode (defaultOptions { unwrapSingleConstructors = true })
instance showColors :: Show Colors where show = genericShow

newtype ColorsRes = ColorsRes 
  { result :: Result
  , status :: Status
  }
derive instance newtypeColorsRes :: Newtype ColorsRes _
derive instance genericColorsRes :: Generic ColorsRes _
instance decodeColorsRes :: Decode ColorsRes where decode = genericDecode (defaultOptions { unwrapSingleConstructors = true })
instance showColorsRes :: Show ColorsRes where show = genericShow

newtype Status = Status
  { text :: String
  , type :: String
  }
derive instance newtypeStatus :: Newtype Status _
derive instance genericStatus :: Generic Status _
instance decodeStatus :: Decode Status where decode = genericDecode (defaultOptions { unwrapSingleConstructors = true })
instance showStatus :: Show Status where show = genericShow

-- | Fetch instance for CreateUser API
instance fetchCreateUserReq :: Fetch ColorsReq ColorsRes where fetch = genericFetch