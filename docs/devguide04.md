---
id: devguide04
title: Defining Positions
sidebar_label: Defining Positions
---
In order to define a position, we first need to designate a collateral
token. This token must be an
[ERC20](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) token
which exists on the same chain as the ConditionalTokens instance.

Then we need at least one condition with a outcome collection, though a
position may refer to multiple conditions each with an associated
outcome collection. Positions become valuable precisely when *all* of
its constituent outcome collections are valuable. More explicitly, the
value of a position is a *product* of the values of those outcome
collections composing the position.

With these ingredients, position identifiers can also be calculated by
hashing the address of the collateral token and the combined collection
ID of all the outcome collections in the position. We say positions are
*deeper* if they contain more conditions and outcome collections, and
*shallower* if they contain less.

As an example, let's suppose that there is an ERC20 token called
DollaCoin which exists at the address
<span style="color:#DB3A3D">`0xD011ad011ad011AD011ad011Ad011Ad011Ad011A`</span>, and it is used as
collateral for some positions. We will denote this token with <span style="color:#DB3A3D">`$`</span>.

We may calculate the position ID for the position <span style="color:#DB3A3D">`$:(A|B)`</span> via:

``` js
web3.utils.soliditySha3({
    t: 'address',
    v: '0xD011ad011ad011AD011ad011Ad011Ad011Ad011A'
}, {
    t: 'bytes32',
    v: '0x229b067e142fce0aea84afb935095c6ecbea8647b8a013e795cc0ced3210a3d5'
})
```

The ID for <span style="color:#DB3A3D">`$:(A|B)` turns out to be
<span style="color:#DB3A3D">`0x5355fd8106a08b14aedf99935210b2c22a7f92abaf8bb00b60fcece1032436b7`.

Similarly, the ID for <span style="color:#DB3A3D">`$:(LO)`</span> can be found to be
<span style="color:#DB3A3D">`0x1958e759291b2bde460cdf2158dea8d0f5c4e22c77ecd09d3ca6a36f01616e02`</span>,
and <span style="color:#DB3A3D">`$:(A|B)&(LO)`</span> has an ID of
<span style="color:#DB3A3D">`0x994b964b94eb15148726de8caa08cac559ec51a90fcbc9cc19aadfdc809f34c9`</span>.

Helper functions for calculating positions also exist:

<span style="color:#009cb4">*function* **getPositionId** *(IERC20 collateralToken, bytes32 collectionId)externalpurereturns (uint)*</span>

Constructs a position ID from a collateral token and an outcome collection. These IDs are used as the ERC-1155 ID for this contract.

**Parameters:**
- **collateralToken** – Collateral token which backs the position.
- **collectionId** – ID of the outcome collection associated with this position.

All the positions backed by DollaCoin which depend on the example
categorical condition and the example scalar condition form a DAG
(directed acyclic graph):

IMAGE HERE