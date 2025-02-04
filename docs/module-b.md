[release-example-002](https://github.com/itsmeid/release-example-002/blob/main/docs/README.md) / module-b

This is package documentation for module-b.

## joinObject()

```ts
function joinObject<A, B>(a, b): A & B
```

Function that return combined object `A` and `B`.

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`A` *extends* `object`

</td>
<td>

The first object type.

</td>
</tr>
<tr>
<td>

`B` *extends* `object`

</td>
<td>

The second object type.

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`a`

</td>
<td>

`A`

</td>
<td>

The first object value.

</td>
</tr>
<tr>
<td>

`b`

</td>
<td>

`B`

</td>
<td>

The second object value.

</td>
</tr>
</tbody>
</table>

### Returns

`A` & `B`

`object` of `a` and `b` combined.

***

## joinObj()

```ts
function joinObj<A, B>(a, b): A & B
```

Alias of [joinObject](https://github.com/itsmeid/release-example-002/blob/main/docs/module-b.md#joinObject)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`A` *extends* `object`

</td>
<td>

The first object type.

</td>
</tr>
<tr>
<td>

`B` *extends* `object`

</td>
<td>

The second object type.

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`a`

</td>
<td>

`A`

</td>
<td>

The first object value.

</td>
</tr>
<tr>
<td>

`b`

</td>
<td>

`B`

</td>
<td>

The second object value.

</td>
</tr>
</tbody>
</table>

### Returns

`A` & `B`

`object` of `a` and `b` combined.
