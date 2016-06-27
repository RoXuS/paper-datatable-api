paper-datatable-api web component
============

[![Build Status](https://travis-ci.org/RoXuS/paper-datatable-api.svg?branch=master)](https://travis-ci.org/RoXuS/paper-datatable-api)

`paper-datatable-api` is a material design implementation of a data table.

See the [component page](https://roxus.github.io/paper-datatable-api/components/paper-datatable-api/) for more information.

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

## Features

- [Follows the guideline of Material Design](https://material.google.com/components/data-tables.html#)
- Hide/Show columns
- Freezes header
- Sort
- Pagination
- Checkboxes to select or manipulate data

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
