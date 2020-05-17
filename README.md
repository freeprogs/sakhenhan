
# sakhenhan

A browser extension for Sakh.com forum https://forum.sakh.com

## Features

- Add likes/dislikes info button on every message
- Unhide bot messages
- Unhide disliked by users messages
- Unhide topic starter hidden messages
- Remove ads from videos

---

## Requirements

This extension has tested in Mozilla Firefox 66.0.5 and Mozilla Firefox 76.0.1 .


## Building

Build the docs and read the README file in _build/docs_.

To build run:

```sh
$ ./configure
$ make
```

After building there is the _build_ directory apears in the project directory.

There are several directories

| name      | description                                     |
|:----------|:------------------------------------------------|
| docs      | Contains documentation for the extension.       |
| sakhenhan | Contains the extension available for debugging. |
| tests     | Contains unit-tests for extension parts.        |
| unsigned  | Contains zipped extension ready for signing.    |

## Testing

After building has done go to _build/tests_ and open page _test_all.html_ in the browser.

If tests don't work, install testing components:

| name                         | description                                    |
|:-----------------------------|:-----------------------------------------------|
| [mocha](http://mochajs.org/) | functions describe(), it() and so on for TDD   |
| [chai](http://chaijs.com/)   | different assert functions for tests           |
| [sinon](http://sinonjs.org/) | mocks and stubs for tests                      |

You can just load three js-files and connect, in testing HTML-pages placed in the _build/tests/_ directory, internal HTML-document paths to these js-files. Then open in the browser the _test_all.html_ file. Everything should work.


## Installation


### Temporary

This is the temporary installation mode that worked only for one run of the browser process and usually used for debugging purposes.

To install the extension, run the browser and open the address
```
about:debugging
```

Then the page for loading temporary extensions will be opened in the browser. Push on the button to load the extension and select file _manifest.json_ in the _build/sakhenhan_ directory.

### Permanent

This is the permanent installation mode that requires the extension file signed through the official site [https://addons.mozilla.com](https://addons.mozilla.com) .

To install the extension, run the browser and open in the browser as a page the xpi-file placed in the _signed/_ directory of the project.
