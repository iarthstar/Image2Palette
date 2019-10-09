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

-- | Fetch instance for Colors API
instance fetchColorsReq :: Fetch ColorsReq ColorsRes where fetch = genericFetch




newtype UsageReq = UsageReq {}
derive instance genericUsageReq :: Generic UsageReq _
instance encodeUsageReq :: Encode UsageReq where encode = genericEncode (defaultOptions { unwrapSingleConstructors = true })

newtype UsageRes = UsageRes 
  { result :: 
      { billing_period_end :: String
      , billing_period_start :: String
      , monthly_limit :: Int
      , monthly_processed :: Int
      , monthly_requests :: Int
      }
  , status :: Status
  }
derive instance newtypeUsageRes :: Newtype UsageRes _
derive instance genericUsageRes :: Generic UsageRes _
instance decodeUsageRes :: Decode UsageRes where decode = genericDecode (defaultOptions { unwrapSingleConstructors = true })
instance showUsageRes :: Show UsageRes where show = genericShow

-- | Fetch instance for Usage API
instance fetchUsageReq :: Fetch UsageReq UsageRes where fetch = genericFetch