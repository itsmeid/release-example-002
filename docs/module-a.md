[release-example-002](https://github.com/itsmeid/release-example-002/tree/main/docs/README.md) / module-a

This is package documentation for module-a.

## joinString()

```ts
function joinString<A, B>(a, b): `${A}${B}`
```

Function that return combined string `A` and `B`.

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

`A` *extends* `string`

</td>
<td>

The first characters type.

</td>
</tr>
<tr>
<td>

`B` *extends* `string`

</td>
<td>

The second characters type.

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

The first characters value.

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

The second characters value.

</td>
</tr>
</tbody>
</table>

### Returns

\`$\{A\}$\{B\}\`

`string` of `a` and `b` combined.

### Defined in

[module-a/module-a.ts:11](https://github.com/itsmeid/release-example-002/blob/0fa203b83865be5ee9f29465ace0928ff194b777/src/module-a/module-a.ts#L11)

***

## joinStr()

```ts
function joinStr<A, B>(a, b): `${A}${B}`
```

Alias of [joinString](https://github.com/itsmeid/release-example-002/tree/main/docs/module-a.md#joinString)

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

`A` *extends* `string`

</td>
<td>

The first characters type.

</td>
</tr>
<tr>
<td>

`B` *extends* `string`

</td>
<td>

The second characters type.

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

The first characters value.

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

The second characters value.

</td>
</tr>
</tbody>
</table>

### Returns

\`$\{A\}$\{B\}\`

`string` of `a` and `b` combined.

### Defined in

[module-a/module-a.ts:21](https://github.com/itsmeid/release-example-002/blob/0fa203b83865be5ee9f29465ace0928ff194b777/src/module-a/module-a.ts#L21)
