module Accessors where

import Prelude

import Data.Newtype (class Newtype, unwrap, wrap)
import Optic.Lens (lens)
import Optic.Types (Lens')

_result :: forall a b c. Newtype a { result :: b | c } => Lens' a b
_result = lens (unwrap >>> _.result) (\oldRec newVal -> wrap ((unwrap oldRec) { result = newVal }))

_colors :: forall a b c. Newtype a { colors :: b | c } => Lens' a b
_colors = lens (unwrap >>> _.colors) (\oldRec newVal -> wrap ((unwrap oldRec) { colors = newVal }))

_background_colors :: forall a b c. Newtype a { background_colors :: b | c } => Lens' a b
_background_colors = lens (unwrap >>> _.background_colors) (\oldRec newVal -> wrap ((unwrap oldRec) { background_colors = newVal }))

_foreground_colors :: forall a b c. Newtype a { foreground_colors :: b | c } => Lens' a b
_foreground_colors = lens (unwrap >>> _.foreground_colors) (\oldRec newVal -> wrap ((unwrap oldRec) { foreground_colors = newVal }))

_image_colors :: forall a b c. Newtype a { image_colors :: b | c } => Lens' a b
_image_colors = lens (unwrap >>> _.image_colors) (\oldRec newVal -> wrap ((unwrap oldRec) { image_colors = newVal }))

_html_code :: forall a b c. Newtype a { html_code :: b | c } => Lens' a b
_html_code = lens (unwrap >>> _.html_code) (\oldRec newVal -> wrap ((unwrap oldRec) { html_code = newVal }))

_width :: forall a b c. Newtype a { width :: b | c } => Lens' a b
_width = lens (unwrap >>> _.width) (\oldRec newVal -> wrap ((unwrap oldRec) { width = newVal }))

_height :: forall a b c. Newtype a { height :: b | c } => Lens' a b
_height = lens (unwrap >>> _.height) (\oldRec newVal -> wrap ((unwrap oldRec) { height = newVal }))

_x :: forall a b c. Newtype a { x :: b | c } => Lens' a b
_x = lens (unwrap >>> _.x) (\oldRec newVal -> wrap ((unwrap oldRec) { x = newVal }))

_y :: forall a b c. Newtype a { y :: b | c } => Lens' a b
_y = lens (unwrap >>> _.y) (\oldRec newVal -> wrap ((unwrap oldRec) { y = newVal }))

_id :: forall a b c. Newtype a { id :: b | c } => Lens' a b
_id = lens (unwrap >>> _.id) (\oldRec newVal -> wrap ((unwrap oldRec) { id = newVal }))

_frame :: forall a b c. Newtype a { frame :: b | c } => Lens' a b
_frame = lens (unwrap >>> _.frame) (\oldRec newVal -> wrap ((unwrap oldRec) { frame = newVal }))