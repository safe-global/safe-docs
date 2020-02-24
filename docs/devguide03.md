---
id: devguide03
title: Outcome Collection
sidebar_label: Outcome Collection
---

The main concept for understanding the mechanics of this system is that
of a *position*. We will build to this concept from conditions and
outcome slots, and then demonstrate the use of this concept.

However, before we can talk about positions, we first have to talk about
*outcome collections*, which may be defined like so:


<span style="color:##001428">**A nonempty proper subset of a condition’s outcome slots which represents the sum total of all the contained slots’payout values.** </span>


## Categorical Example Featuring Alice, Bob, and Carol

We'll denote the outcome slots for Alice, Bob, and Carol as <span style="color:#DB3A3D">`A`</span>, <span style="color:#DB3A3D">`B`</span>,
and <span style="color:#DB3A3D">`C`</span> respectively.

A valid outcome collection may be <span style="color:#DB3A3D">`(A|B)`</span>. In this example, this outcome
collection represents the eventuality in which either Alice or Bob is
chosen. Note that for a categorical condition, the payout vector which
the oracle reports will eventually contain a one in exactly one of the
three slots, so the sum of the values in Alice's and Bob's slots is one
precisely when either Alice or Bob is chosen, and zero otherwise.

<span style="color:#DB3A3D">`(C)`</span> by itself is also a valid outcome collection, and this simply
represents the case where Carol is chosen.

<span style="color:#DB3A3D">`()`</span> is an invalid outcome collection, as it is empty. Empty outcome
collections do not make sense, as they would essentially represent no
eventuality and have no value no matter what happens.

Conversely, <span style="color:#DB3A3D">`(A|B|C)`</span> is also an invalid outcome collection, as it is
not a proper subset. Outcome collections consisting of all the outcome
slots for a condition also do not make sense, as they would simply
represent any eventuality, and should be equivalent to whatever was used
to collateralize these outcome collections.

Finally, outcome slots from different conditions (e.g. <span style="color:#DB3A3D">`(A|X)`</span>) cannot
be composed in a single outcome collection.

## Index Set Representation and Identifier Derivation

A outcome collection may be represented by an a condition and an *index
set*. This is a 256 bit array which denotes which outcome slots are
present in a outcome collection. For example, the value `3 == 0b011`
corresponds to the outcome collection <span style="color:#DB3A3D">`(A|B)`</span>, whereas the value <span style="color:#DB3A3D">`4
== 0b100`</span> corresponds to <span style="color:#DB3A3D">`(C)`</span>. Note that the indices start at the
lowest bit in a <span style="color:#DB3A3D">`uint`</span>.

A outcome collection may be identified with a 32 byte value called a
*collection identifier*. Calculating the collection ID for an outcome
collection involves hashing its condition ID and index set into a point
on the [alt\_bn128](https://eips.ethereum.org/EIPS/eip-196) elliptic curve.



> **Note** In order to calculate the collection ID for `(A|B)`, the following steps
must be performed:

1.  An initial value for the point x-coordinate is set by hashing the
    condition ID and the index set of the outcome collection, and
    interpreting the resulting hash as a big-endian integer.
    
    ``` js
    web3.utils.soliditySha3({
        // See section "A Categorical Example" for derivation of this condition ID
        t: 'bytes32',
        v: '0x67eb23e8932765c1d7a094838c928476df8c50d1d3898f278ef1fb2a62afab63'
    }, {
        t: 'uint',
        v: 0b011 // Binary Number literals supported in newer versions of JavaScript
    })
    ```
    
    This results in an initial x-coordinate of
    <span style="color:#DB3A3D">`0x52ff54f0f5616e34a2d4f56fb68ab4cc636bf0d92111de74d1ec99040a8da118`</span>,
    or  <span style="color:#DB3A3D">`37540785828268254412066351790903087640191294994197155621611396915481249947928`</span>.

	An <span style="color:#DB3A3D">`odd`</span>. flag is set according to whether the highest bit of the hash
	result is set. In this case, because the highest bit of the hashing
	result is not set,<span style="color:#DB3A3D">`odd = false`</span>.
 
2.  The x-coordinate gets incremented by one modulo the order of the
     [alt\_bn128](https://eips.ethereum.org/EIPS/eip-196) base field, which is
     <span style="color:#DB3A3D">`21888242871839275222246405745257275088696311157297823662689037894645226208583`</span>.
      
     The first time, this results in an updated x-coordinate <span style="color:#DB3A3D">`x= 15652542956428979189819946045645812551494983836899331958922359020836023739346`</span>.
 
 3.  The x-coordinate is checked to see if it is the x-coordinate of
     points on the elliptic curve. Specifically, <span style="color:#DB3A3D">`x**3 + 3`</span> gets
     computed in the base field, and if the result is a quadratic
      residue, the x-coordinate belongs to a pair of points on the
     elliptic curve. If the result is a non-residue however, return
     to step 2.
     
     When <span style="color:#DB3A3D">`x= 15652542956428979189819946045645812551494983836899331958922359020836023739346`</span>,
     <span style="color:#DB3A3D">`x**3 + 3
     == 7181824697751204416624405172148440000524665091599802536460745194285959874882`</span>
     is not a quadratic residue in the base field, so go back to step 2.
     
     When <span style="color:#DB3A3D">`x= 15652542956428979189819946045645812551494983836899331958922359020836023739347`</span>,
     <span style="color:#DB3A3D">`x**3 + 3== 19234863727839675005817902755221636205208068129817953505352549927470359854418`</span>
     is also not a quadratic residue in the base field, so go back to
     step 2.
     
     When <span style="color:#DB3A3D">`x= 15652542956428979189819946045645812551494983836899331958922359020836023739348`</span>,
     <span style="color:#DB3A3D">`x**3 + 3
     == 15761946137305644622699047885883332275379818402942977914333319312444771227121`</span>
     is still not a quadratic residue in the base field, so go back
     to step 2.
     
     When <span style="color:#DB3A3D">`x= 15652542956428979189819946045645812551494983836899331958922359020836023739349`</span>,
     <span style="color:#DB3A3D">`x**3 + 3 == 18651314797988388489514246309390803299736227068272699426092091243854420201580`</span>
     is a quadratic residue in the base field, so we have found a
     pair of points on the curve, and we may continue.
 
 4.  Note that the base field occupies 254 bits of space, meaning the
     x-coordinate we found also occupies 254 bits of space, and has
     two free bits in an EVM word (256 bits). Leave the highest bit
     unset, and set the next highest bit if <span style="color:#DB3A3D">`odd == true`</span>. In our
     example,<span style="color:#DB3A3D"> `odd`</span> is unset, so we're done, and the collection ID
     for <span style="color:#DB3A3D">`(A|B)`</span> is
     <span style="color:#DB3A3D">`15652542956428979189819946045645812551494983836899331958922359020836023739349`</span>,
     or
     <span style="color:#DB3A3D">`0x229b067e142fce0aea84afb935095c6ecbea8647b8a013e795cc0ced3210a3d5`</span>.

We may also combine collection IDs for outcome collections for different
conditions by performing elliptic curve point addition on them.

> **Note** Let's denote the slots for range ends 0 and 1000 from our scalar
condition example as `LO` and `HI`. We can find the collection ID for
`(LO)` to be
`0x560ae373ed304932b6f424c8a243842092c117645533390a3c1c95ff481587c2`
using the procedure illustrated in the previous note. The combined collection ID for `(A|B)&(LO)` can be calculated in the
following manner:

1.  Decompress the constituent collection IDs into elliptic curve point
    coordinates. Take the low 254 bits as the x-coordinate, and pick the
    y-coordinate which is even or odd depending on the value of the
    second highest bit.
    
      - <span style="color:#DB3A3D">`(A|B)`</span>, which has a collection ID of
        <span style="color:#DB3A3D">`0x229b067e142fce0aea84afb935095c6ecbea8647b8a013e795cc0ced3210a3d5`</span>,
        gets decompressed to the point:
        
            (15652542956428979189819946045645812551494983836899331958922359020836023739349,
            11459896044816691076313215195950563425899182565928550352639564868174527712586)
        
        Note the even y-coordinate is chosen here.
    
      - <span style="color:#DB3A3D">`(LO)`</span>, which has a collection ID of
        <span style="color:#DB3A3D">`0x560ae373ed304932b6f424c8a243842092c117645533390a3c1c95ff481587c2`</span>,
        gets decompressed to the point:
        
            (9970120961273109372766525305441055537695652051815636823675568206550524069826,
            5871835597783351455285190273403665696556137392019654883787357811704360229175)
        
        The odd y-coordinate indication bit was chopped off the
        compressed form before its use as the decompressed form's
        x-coordinate, and the odd y-coordinate is chosen here.

2.  Perform point addition on the
    [alt\_bn128](https://eips.ethereum.org/EIPS/eip-196) curve with
    these points. The sum of these points is the point:
    
        (21460418698095194776649446887647175906168566678584695492252634897075584178441,
        4596536621806896659272941037410436605631447622293229168614769592376282983323)

3.  Compress the result by taking the x-coordinate, and setting the
    second highest bit, which should be just outside the x-coordinate,
    depending on whether the y-coordinate was odd. The combined
    collection ID for <span style="color:#DB3A3D">`(A|B)&(LO)`</span> is
    <span style="color:#DB3A3D">`0x6f722aa250221af2eba9868fc9d7d43994794177dd6fa7766e3e72ba3c111909`</span>.

<span style="color:#e8663d">**Warning**</span>

<span style="color:#e8663d"> **Both bitwise XOR and truncated addition is not used in this scenario
because these operations are vulnerable to collisions via [a generalized
birthday attack](https://link.springer.com/chapter/10.1007/3-540-45708-9_19).**</span>


Similar to with conditions, the contract and the `CTHelpers` library
also provide helper functions for calculating outcome collection IDs:

<span style="color:#009cb4">*function* **getCollectionId** *(bytes32 parentCollectionId, bytes32 conditionId, uint indexSet)externalviewreturns(bytes32)*</span>
	
Constructs an outcome collection ID from a parent collection and an outcome collection.

**Parameters:**	
- **parentCollectionId** – Collection ID of the parent outcome collection, or bytes32(0) if there’s no parent.
- **conditionId** – Condition ID of the outcome collection to combine with the parent outcome collection.
- **indexSet** – Index set of the outcome collection to combine with the parent outcome collection.