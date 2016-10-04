paper-datatable-api web component
============

[![Build Status](https://travis-ci.org/RoXuS/paper-datatable-api.svg?branch=master)](https://travis-ci.org/RoXuS/paper-datatable-api)

`paper-datatable-api` is a material design implementation of a data table.

See the [component page](https://roxus.github.io/paper-datatable-api/components/paper-datatable-api/#paper-datatable-api) for more information.

```html
<link rel="import" href="bower_components/paper-datatable-api/dist/paper-datatable-api-column.html">
<link rel="import" href="bower_components/paper-datatable-api/dist/paper-datatable-api.html">

<iron-ajax auto url="data.json" last-response="{{data}}"></iron-ajax>

<paper-datatable-api data="[[data]]">
  <paper-datatable-api-column header="Fruit" property="fruit">
    <template>
      <span>{{value}}</span>
    </template>
  </paper-datatable-api-column>
  <paper-datatable-api-column header="Color" property="color">
    <template>
      <span>{{value}}</span>
    </template>
  </paper-datatable-api-column>
</paper-datatable-api>
```

## Features

- [Follows the guideline of Material Design](https://material.google.com/components/data-tables.html#)
- Hide/Show columns
- Choose which columns can be hidden or not
- Sort
- Pagination
- Checkboxes to select or manipulate data
- Keep the selected data throught the pages
- Filter a column
- Ability to filter columns
- Frozen header

## Roadmap

- Freezes a column
- Display only selected rows

## Install

```
$ bower install paper-datatable-api --save
```

## Serve component 

```
$ polymer serve --open
```

## Running Tests

```
$ polymer test
```

## Build dist

```
$ npm install
$ gulp build
```

## Development

To build the project on changes in the src folder
```
$ gulp watch
```

## License
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 of the License as published by the Free Software Foundation.

## Inspired by [the work of David-Mulder on paper-datatable](https://github.com/David-Mulder/paper-datatable)
