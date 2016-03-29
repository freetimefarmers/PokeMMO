import {
  DIMENSION, GRAVITY,
  LEFT, RIGHT, UP, DOWN,
  SHADOW_X, SHADOW_Y,
  WGL_SUPPORT,
  IS_CLIENT
} from "../../cfg";

import math from "../../Math";
import { TextureCache, getSprite, createCanvasBuffer } from "../utils";

import DisplayObject from "../DisplayObject";
import Texture from "../Texture";
import Shadow from "../Shadow";

/**
 * Entity
 * @class Entity
 * @export
 */
export default class Entity extends DisplayObject {

  /**
   * @param {Object} obj
   * @constructor
   */
  constructor(obj) {

    super(null);

    /**
     * Name
     * @type {String}
     */
    this.name = obj.name || null;

    /**
     * Last position
     * @type {Object}
     */
    this.last = new math.Point();

    /**
     * States
     * @type {Object}
     */
    this.STATES = {
      JUMPING: false,
      LOCK:    false,
      EDITING: false
    };

    /**
     * Socket
     * @type {Object}
     */
    this.socket = null;

    /**
     * Life time
     * @type {Number}
     */
    this.lifeTime = 0;

    /**
     * Z priority
     * @type {Number}
     */
    this.zIndex = obj.zIndex === void 0 ? 1 : obj.zIndex;

    /**
     * Collidable
     * @type {Boolean}
     */
    this.collidable = obj.collidable || false;

    /**
     * Collision box
     * @type {Array}
     */
    this.collisionBox = obj.collisionBox === void 0 ? [] : obj.collisionBox;

    /**
     * Texture
     * @type {Object}
     */
    this.texture = null;

    /**
     * Animation
     * @type {Boolean}
     */
    this.animation = obj.animation === true || false;

    /**
     * Animation start
     * @type {Number}
     */
    this.animationStart = obj.animationStart === void 0 ? 0 : obj.animationStart;

    /**
     * Animation speed
     * @type {Number}
     */
    this.animationSpeed = obj.animationSpeed === void 0 ? 300 : obj.animationSpeed;

    /**
     * Looped animation
     * @type {Boolean}
     */
    this.loop = obj.loop === void 0 ? false : obj.loop;

    /**
     * Animation frames
     * @type {Number}
     */
    this.animationFrames = obj.animationFrames === void 0 ? 0 : obj.animationFrames;

    /**
     * Frames
     * @type {Array}
     */
    this.frames = obj.frames === void 0 ? [0] : obj.frames;

    /**
     * Sprite frame
     * @type {Number}
     */
    this.sFrame = 0;

    /**
     * Current frame
     * @type {Number}
     */
    this.frame = 0;

    /**
     * Last frame
     * @type {Number}
     */
    this.lastFrame = 0;

    /**
     * Opacity
     * @type {Number}
     */
    this.opacity = .0;

    /**
     * Gravity
     * @type {Number}
     */
    this.gravity = GRAVITY;

    /**
     * Sprite
     * @type {String}
     */
    this.sprite = obj.sprite;

    /**
     * Reversed facing
     * @type {Array}
     */
    this.reversed = [2, 3, 0, 1];

    /**
     * Reverse shadow
     * @type {Array}
     */
    this.reverseShadow = [2, 3, 1, 0];

    /**
     * Entity scale
     * @type {Number}
     */
    this.scale = obj.scale === void 0 ? 1 : obj.scale;

    /**
     * Animations
     * @type {Array}
     */
    this.animations = [];

    /**
     * Shadow entity ref
     * @type {Object}
     */
    this.shadow = null;

    /**
     * Entity has shadow
     * @type {Boolean}
     */
    this.hasShadow = obj.shadow === void 0 ? true : obj.shadow;

    /**
     * Animation index
     * @type {Number}
     */
    this.animationIndex = 0;

    /**
     * Sprite margin
     * @type {Number}
     */
    this.xMargin = 0;
    this.yMargin = 0;

    /**
     * Sizes
     * @type {Number}
     */
    this.width = 0;
    this.height = 0;

    /**
     * Position
     * @type {Number}
     */
    this.x = 0;
    this.y = 0;

    /**
     * Z axis position
     * @type {Number}
     */
    this.z = .0;

    /**
     * Velocity
     * @type {Number}
     */
    this.velocity = 1.0;

    /**
     * Orbiting
     * @type {Boolean}
     */
    this.orbit = false;

    /**
     * Orbit angle
     * @type {Number}
     */
    this.orbitAngle = 0;

    /**
     * Target to orbit
     * @type {Object}
     */
    this.orbitTarget = null;

    /**
     * Stop orbit
     * @type {Boolean}
     */
    this.stopOrbit = false;

    /**
     * Idle time
     * @type {Number}
     */
    this.idleTime = 0;

    if (
      obj.x !== void 0 &&
      obj.y !== void 0
    ) {
      this.x = obj.x;
      this.y = obj.y;
    }

    /** Entity size */
    if (obj.width)  this.width = obj.width;
    if (obj.height) this.height = obj.height;

    /**
     * Shadow offsets
     * @type {Number}
     */
    this.shadowX = obj.shadowX === void 0 ? 0 : obj.shadowX;
    this.shadowY = obj.shadowY === void 0 ? -this.height / 2 : obj.shadowY;

    /**
     * WebGL texture
     * @type {Object}
     */
    this.glTexture = null;

    /**
     * Enter trigger
     * @type {Function}
     */
    this.onLoad = null;

    /**
     * Enter trigger
     * @type {Function}
     */
    this.onEnter = null;

    /**
     * Leave trigger
     * @type {Function}
     */
    this.onLeave = null;

    /**
     * Collide trigger
     * @type {Function}
     */
    this.onCollide = null;

    if (obj.onLoad !== void 0) {
      this.onLoad = obj.onLoad;
    }
    if (obj.onEnter !== void 0) {
      this.onEnter = obj.onEnter;
    }
    if (obj.onLeave !== void 0) {
      this.onLeave = obj.onLeave;
    }
    if (obj.onCollide !== void 0) {
      this.onCollide = obj.onCollide;
    }

    /**
     * X
     * @type {Number}
     * @getter
     * @setter
     * @overwrite
     */
    Object.defineProperty(this, "x", {
      get: function() {
        return (this.position.x);
      },
      set: function(value) {
        this.position.x = value;
      }
    });

    /**
     * Y
     * @type {Number}
     * @getter
     * @setter
     * @overwrite
     */
    Object.defineProperty(this, "y", {
      get: function() {
        return (this.position.y);
      },
      set: function(value) {
        this.position.y = value;
      }
    });

    if (IS_CLIENT === false) return void 0;

    /** Load texture */
    getSprite(
      this.sprite, this.width, this.height, this::function(texture) {
      this.texture = texture;
      if (this.hasShadow === true) {
        this.shadow = new Shadow(this);
        this.shadow.position.set(this.shadowX, this.shadowY);
      }
      if (WGL_SUPPORT === true) {
        this.glTexture = window.game.engine.renderer.glRenderer.bufferTexture(this.texture.effect_sprites[0].canvas);
      }
      if (
        this.onLoad !== null &&
        this.onLoad instanceof Function
      ) {
        this.onLoad();
      }
    });

  }

  /**
   * Orbit around a entity
   * @param  {Object} target
   */
  orbitAround(target) {
    if (target !== null) {
      this.orbit = true;
      this.orbitTarget = target;
    } else {
      this.orbit = false;
    }
  }

  /**
   * Refresh entity states
   */
  refreshState() {
    this.STATES.JUMPING = this.z !== 0;
  }

  /**
   * Jump
   */
  jump() {

    this.refreshState();

    if (
      this.STATES.JUMPING === true ||
      this.STATES.LOCK === true
    ) return void 0;

    this.STATES.JUMPING = true;

    this.idleTime = 0;

  }

  /**
   * Jumping
   */
  jumping() {

    this.z += this.gravity;

    this.refreshState();

    if (this.z < 0) {
      this.gravity += .1;
      if (this.hasShadow === true) {
        this.shadow.position.x = -(this.z / 2);
        this.shadow.position.y = this.shadowY - (this.z);
        this.shadow.scale.x = this.z;
        this.shadow.scale.y = this.z;
      }
    } else {
      this.gravity = GRAVITY;
      this.z = 0;
      this.refreshState();
      if (this.hasShadow === true) {
        this.shadow.position.x = this.shadowX;
        this.shadow.position.y = this.shadowY;
        this.shadow.scale.x = 0;
        this.shadow.scale.y = 0;
      }
    }

  }

  /** Animate */
  animate() {

    if (this.STATES.JUMPING === true) {
      this.jumping();
    }

    if (this.animations.length <= 0) return void 0;

    this.animationIndex = 0;

    for (var ii = 0; ii < this.animations.length; ++ii) {
      this[this.animations[this.animationIndex].type](this.animations[this.animationIndex]);
      this.animationIndex++;
    };

  }

  /**
   * Stop current animation
   */
  stopAnimation() {
    this.animations.splice(this.animationIndex, 1);
  }

  /**
   * Entity has customized opacity
   * @return {Boolean}
   */
  customOpacity() {
    return (
      this.opacity !== 1.0 &&
      this.opacity !== 0.0
    );
  }

  /**
   * Fade in
   * @param {Number} speed
   */
  fadeIn(speed = speed || 1) {
    this.animations.push({
      type: "fade",
      fade: 1,
      speed: speed
    });
  }

  /**
   * Fade out
   * @param {Number} speed
   * @param {Boolean} kill
   */
  fadeOut(speed = speed || 1, kill) {
    this.animations.push({
      type: "fade",
      fade: 0,
      kill: kill,
      speed: speed
    });
  }

  /**
   * Fade animation
   * @param {Object} animation
   */
  fade(animation) {

    let speed = animation.speed / 4 / 10;

    this.opacity += animation.fade === 1 ? speed : -speed;

    if (animation.fade === 1 && this.opacity > 1) {
      this.opacity = 1.0;
      this.stopAnimation();
    } else if (animation.fade === 0 && this.opacity < 0) {
      this.opacity = animation.kill === true ? -.01 : .0;
      this.stopAnimation();
    }

  }

  /**
   * Shadow facing
   * @param  {Number} dir
   * @return {Number}
   */
  shadowFacing(dir) {
    return (
      this.reverseShadow[dir]
    );
  }

  /**
   * Reverse dir
   * @param  {Number} dir
   * @return {Number}
   */
  reverseDir(dir) {
    return (
      this.reversed[dir]
    );
  }

  /**
   * Facing to key
   * @param  {Number} key
   * @return {Number}
   */
  facingToKey(facing) {
    return (
      facing === LEFT  ? 37 :
      facing === UP    ? 38 :
      facing === RIGHT ? 39 :
      facing === DOWN  ? 40 : 38
    );
  }

  /**
   * Key to facing
   * @param  {Number} key
   * @return {Number}
   */
  keyToFacing(key) {
    return (
      key === 37 ? LEFT  :
      key === 38 ? UP    :
      key === 39 ? RIGHT :
      key === 40 ? DOWN  : UP
    );
  }

  /**
   * Opposit facing
   * @param  {Number} key
   * @return {Number}
   */
  oppositFacing(key) {
    return (
      key === LEFT  ? RIGHT :
      key === RIGHT ? LEFT  :
      key === DOWN  ? UP    :
      key === UP    ? DOWN  : UP
    );
  }

}