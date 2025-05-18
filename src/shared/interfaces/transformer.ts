/**
 * Encoder of an internal business model `Int` into an external representation `Ext`.
 * @see {@link Decoder}, {@link Transformer}.
 */
export interface Encoder<Int, Ext> {
  encode(data: Int): Ext
}

/**
 * Decoder of an internal business model `Int` from an external representation `Ext`.
 * @see {@link Encoder}, {@link Transformer}.
 */
export interface Decoder<Int, Ext> {
  decode(data: Ext): Int
}

/**
 * Two-way transformer between an internal business model `Int` and an external representation `Ext`.
 * @see {@link Encoder}, {@link Decoder}.
 */
export interface Transformer<Int, Ext> extends Encoder<Int, Ext>, Decoder<Int, Ext> {}
