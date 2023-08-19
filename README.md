# unflatten-next-routes <!-- omit from toc -->

[![npm version][npm-version-src]][npm-version-href]
[![Github Actions][github-actions-src]][github-actions-href]

> Enabling flat routes for Next.js

## Table of Contents <!-- omit from toc -->

- [Introduction](#introduction)
- [Usage](#usage)
- [About flat routes](#about-flat-routes)
- [Index route files](#index-route-files)
- [Supported file extensions](#supported-file-extensions)
- [License](#license)

---

## Introduction

With the introduction of Next.js 13, a new folder-based routing mechanism was unveiled. While this approach offers powerful and flexible routing capabilities, it brings with it the challenge of managing deeply nested route files. In large projects with a myriad of routes, locating a specific route or deciphering the intricate structure of the application becomes increasingly complex.

Enter `unflatten-next-routes`.

Designed specifically for Next.js 13, `unflatten-next-routes` is a CLI tool that allows developers to work with a flat route file structure that is easier to manage and understand. With `unflatten-next-routes` your routes can be structured like this:

```
app/
|-- shop/
    |-- routes/
        |-- basket.(page).tsx
        |-- product.(page).tsx
        |-- product.[id].(page).tsx

```

... and `unflatten-next-routes` will ensure that these routes are transformed into the nested format that Next.js expects.

## Usage

To start using the CLI tool, run the following command in the Next.js project root:

```sh
npx unflatten-next-routes@latest
```

This will initiate the tool in watch mode. Then add flat route files within any `/routes/` folder located within the `app` directory. As you add, rename, or remove these flat route files, the equivalent nested route file will be generated or updated within a parallel `/(.routes)/` directory.

Example:

```
app/
|-- shop/
    |-- (.routes)/
    |   |-- basket/
    |   |   |-- page.tsx
    |   |-- product/
    |       |-- page.tsx
    |       |-- [id]/
    |           |-- page.tsx
    |-- routes/
        |-- basket.(page).tsx
        |-- product.(page).tsx
        |-- product.[id].(page).tsx

```

> Note: The `/(.routes)/` directory should be considered as "private", similar to the `.next` directory that Next.js uses for its build output. Files within this directory are auto-generated and should not be manually edited.

## About flat routes

Flat routes can be created for `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` and `route.tsx` files. All that is required is for their flat route equivalent filenames to end with `.(page).tsx`, `.(layout).tsx`, `.(loading).tsx`, `.(error).tsx` and `.(route).tsx` .

Example:

```
/app/shop/routes/basket.(page).tsx
/app/shop/routes/product.(layout).tsx
/app/shop/routes/product.[productId].(page).tsx
/app/admin/routes/settings.(page).tsx
```

## Index route files

For flat index route files, there's no need to prefix the route filename. For instance, the admin homepage will be:

```
/app/admin/(page).tsx
/app/admin/(error).tsx
```

## Supported file extensions

The tool supports .tsx, .jsx, and .js file extensions for flat route files.

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unflatten-next-routes?style=flat-square
[npm-version-href]: https://npmjs.com/package/unflatten-next-routes
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/unjs/unflatten-next-routes/ci.yml?style=flat-square
[github-actions-href]: https://github.com/unjs/unflatten-next-routes/actions?query=workflow%3Aci
