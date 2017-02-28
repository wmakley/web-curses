/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WebCurses_1 = __webpack_require__(4);
var Entity_1 = __webpack_require__(1);
var Map_1 = __webpack_require__(2);
var Game = (function () {
    function Game(canvas, fontSize) {
        var _this = this;
        this.canvas = canvas;
        this.fontSize = fontSize;
        this.debug = canvas.dataset['debug'] === 'true';
        this.screen = new WebCurses_1.WebCurses(canvas, fontSize);
        this.player = new Entity_1.Entity({ x: 10, y: 10 }, '@', '#FFFFFF');
        this.map = new Map_1.Map(this.screen.horizontalTiles, this.screen.verticalTiles);
        window.addEventListener('keydown', function (event) {
            if (_this.debug)
                console.log('keydown : ' + event.key);
            var key = event.key;
            switch (key) {
                case 'ArrowUp':
                    event.preventDefault();
                    if (_this.player.moveUp(_this.map))
                        _this.drawFrame();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if (_this.player.moveDown(_this.map))
                        _this.drawFrame();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    if (_this.player.moveLeft(_this.map))
                        _this.drawFrame();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if (_this.player.moveRight(_this.map))
                        _this.drawFrame();
                    break;
            }
        });
        this.drawFrame();
    }
    Game.prototype.drawFrame = function () {
        this.drawBackground();
        this.drawEntity(this.player);
    };
    Game.prototype.drawBackground = function () {
        var _this = this;
        this.screen.clear('#000000');
        this.map.eachTile(function (x, y, tile) {
            var tileType = tile.type;
            _this.screen.putChar(tileType.char, x, y, tileType.color, tileType.bgColor);
        });
    };
    Game.prototype.drawEntity = function (entity) {
        var x = entity.pos.x;
        var y = entity.pos.y;
        this.screen.putChar(entity.char, x, y, entity.color, '#000000');
    };
    return Game;
}());
exports.Game = Game;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Entity = (function () {
    function Entity(pos, char, color) {
        this.pos = pos;
        this.char = char;
        this.color = color;
    }
    Entity.prototype.moveUp = function (map) {
        return this.moveTo(this.pos.x, this.pos.y - 1, map);
    };
    Entity.prototype.moveDown = function (map) {
        return this.moveTo(this.pos.x, this.pos.y + 1, map);
    };
    Entity.prototype.moveLeft = function (map) {
        return this.moveTo(this.pos.x - 1, this.pos.y, map);
    };
    Entity.prototype.moveRight = function (map) {
        return this.moveTo(this.pos.x + 1, this.pos.y, map);
    };
    Entity.prototype.moveTo = function (x, y, map) {
        if (map.isPassable(x, y)) {
            this.pos.x = x;
            this.pos.y = y;
            return true;
        }
        return false;
    };
    return Entity;
}());
exports.Entity = Entity;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = __webpack_require__(3);
var Map = (function () {
    function Map(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        var x, y, tile;
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (x === 5) {
                    tile = { type: TileType_1.Wall };
                }
                else {
                    tile = { type: TileType_1.Floor };
                }
                this.tiles.push(tile);
            }
        }
    }
    Map.prototype.tileAt = function (x, y) {
        return this.tiles[x * y];
    };
    Map.prototype.eachTile = function (callback) {
        var x, y, tile, result;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                tile = this.tiles[x * y];
                callback(x, y, tile);
            }
        }
    };
    Map.prototype.isPassable = function (x, y) {
        var tile = this.tileAt(x, y);
        return tile.type.passable;
    };
    return Map;
}());
exports.Map = Map;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Floor = {
    name: 'Floor',
    char: '.',
    color: '#999999',
    passable: true
};
exports.Wall = {
    name: 'Wall',
    char: '#',
    color: '#CCCCCC',
    bgColor: '#333333',
    passable: false
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WebCurses = (function () {
    function WebCurses(canvas, fontSize) {
        this.canvas = canvas;
        this.fontSize = fontSize;
        this.ctx = canvas.getContext('2d');
        this.widthInPixels = canvas.width;
        this.heightInPixels = canvas.height;
        this.horizontalTiles = Math.floor(this.widthInPixels / fontSize);
        this.verticalTiles = Math.floor(this.heightInPixels / fontSize);
        if (typeof window.devicePixelRatio === 'number') {
            canvas.style.width = canvas.width.toString() + 'px';
            canvas.style.height = canvas.height.toString() + 'px';
            canvas.width = canvas.width * window.devicePixelRatio;
            canvas.height = canvas.height * window.devicePixelRatio;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        this.ctx.font = this.fontSize + 'px Menlo';
        this.fontXCorrection = 2.5;
        this.fontYCorrection = -2;
        this.clear();
    }
    WebCurses.prototype.clear = function (color) {
        this.ctx.fillStyle = color || '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    WebCurses.prototype.putChar = function (ch, x, y, color, bgColor) {
        var screenX = x * this.fontSize;
        var screenY = (y + 1) * this.fontSize;
        if (typeof bgColor === 'string') {
            this.ctx.fillStyle = bgColor;
            this.ctx.fillRect(screenX, screenY - this.fontSize, this.fontSize, this.fontSize);
        }
        this.ctx.fillStyle = color;
        this.ctx.fillText(ch, screenX + this.fontXCorrection, screenY + this.fontYCorrection, this.fontSize);
    };
    return WebCurses;
}());
exports.WebCurses = WebCurses;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(0);
document.addEventListener('DOMContentLoaded', function (event) {
    var canvas = document.getElementById('canvas');
    var fontSize = parseInt(canvas.dataset['fontSize']);
    window['Game'] = new Game_1.Game(canvas, fontSize);
});


/***/ })
/******/ ]);