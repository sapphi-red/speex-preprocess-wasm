#! /bin/bash
set -eux

SCRIPT_DIR=`dirname $0`
cd $SCRIPT_DIR

cd speexdsp

NAME=speex
OUT_DIR=../wasm-out

bash ./autogen.sh
emconfigure ./configure --disable-examples --enable-neon=no
emmake make

emcc \
  -s STRICT=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MALLOC=emmalloc \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS="['_speex_preprocess_state_init', '_speex_preprocess_state_destroy', '_speex_preprocess_run', '_speex_preprocess_ctl', '_malloc', '_free']" \
  libspeexdsp/.libs/libspeexdsp.a \
  -o $NAME.js

rm a.wasm

mv $NAME.js ../$OUT_DIR/
mv $NAME.wasm ../$OUT_DIR/

cd ..
