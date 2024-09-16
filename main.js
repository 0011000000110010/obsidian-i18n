/*
这是 ESBUILD 生成/绑定 的文件
如果你想查看源代码,请访问该插件的github存储库
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.store/universalify@2.0.1/node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/.store/universalify@2.0.1/node_modules/universalify/index.js"(exports) {
    "use strict";
    exports.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function")
          fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            args.push((err, res) => err != null ? reject(err) : resolve(res));
            fn.apply(this, args);
          });
        }
      }, "name", { value: fn.name });
    };
    exports.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function")
          return fn.apply(this, args);
        else {
          args.pop();
          fn.apply(this, args).then((r) => cb(null, r), cb);
        }
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/polyfills.js"(exports, module2) {
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs4) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs4);
      }
      if (!fs4.lutimes) {
        patchLutimes(fs4);
      }
      fs4.chown = chownFix(fs4.chown);
      fs4.fchown = chownFix(fs4.fchown);
      fs4.lchown = chownFix(fs4.lchown);
      fs4.chmod = chmodFix(fs4.chmod);
      fs4.fchmod = chmodFix(fs4.fchmod);
      fs4.lchmod = chmodFix(fs4.lchmod);
      fs4.chownSync = chownFixSync(fs4.chownSync);
      fs4.fchownSync = chownFixSync(fs4.fchownSync);
      fs4.lchownSync = chownFixSync(fs4.lchownSync);
      fs4.chmodSync = chmodFixSync(fs4.chmodSync);
      fs4.fchmodSync = chmodFixSync(fs4.fchmodSync);
      fs4.lchmodSync = chmodFixSync(fs4.lchmodSync);
      fs4.stat = statFix(fs4.stat);
      fs4.fstat = statFix(fs4.fstat);
      fs4.lstat = statFix(fs4.lstat);
      fs4.statSync = statFixSync(fs4.statSync);
      fs4.fstatSync = statFixSync(fs4.fstatSync);
      fs4.lstatSync = statFixSync(fs4.lstatSync);
      if (fs4.chmod && !fs4.lchmod) {
        fs4.lchmod = function(path4, mode, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs4.lchmodSync = function() {
        };
      }
      if (fs4.chown && !fs4.lchown) {
        fs4.lchown = function(path4, uid, gid, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs4.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs4.rename = typeof fs4.rename !== "function" ? fs4.rename : function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs4.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb)
                cb(er);
            });
          }
          if (Object.setPrototypeOf)
            Object.setPrototypeOf(rename, fs$rename);
          return rename;
        }(fs4.rename);
      }
      fs4.read = typeof fs4.read !== "function" ? fs4.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs4, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs4, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(read, fs$read);
        return read;
      }(fs4.read);
      fs4.readSync = typeof fs4.readSync !== "function" ? fs4.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs4, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs4.readSync);
      function patchLchmod(fs5) {
        fs5.lchmod = function(path4, mode, callback) {
          fs5.open(
            path4,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback)
                  callback(err);
                return;
              }
              fs5.fchmod(fd, mode, function(err2) {
                fs5.close(fd, function(err22) {
                  if (callback)
                    callback(err2 || err22);
                });
              });
            }
          );
        };
        fs5.lchmodSync = function(path4, mode) {
          var fd = fs5.openSync(path4, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs5.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs5.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs5.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs5) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs5.futimes) {
          fs5.lutimes = function(path4, at, mt, cb) {
            fs5.open(path4, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb)
                  cb(er);
                return;
              }
              fs5.futimes(fd, at, mt, function(er2) {
                fs5.close(fd, function(er22) {
                  if (cb)
                    cb(er2 || er22);
                });
              });
            });
          };
          fs5.lutimesSync = function(path4, at, mt) {
            var fd = fs5.openSync(path4, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs5.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs5.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs5.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs5.futimes) {
          fs5.lutimes = function(_a, _b, _c, cb) {
            if (cb)
              process.nextTick(cb);
          };
          fs5.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig)
          return orig;
        return function(target, mode, cb) {
          return orig.call(fs4, target, mode, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, mode) {
          try {
            return orig.call(fs4, target, mode);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs4, target, uid, gid, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs4, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig)
          return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0)
                stats.uid += 4294967296;
              if (stats.gid < 0)
                stats.gid += 4294967296;
            }
            if (cb)
              cb.apply(this, arguments);
          }
          return options ? orig.call(fs4, target, options, callback) : orig.call(fs4, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs4, target, options) : orig.call(fs4, target);
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/legacy-streams.js"(exports, module2) {
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs4) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path4, options) {
        if (!(this instanceof ReadStream))
          return new ReadStream(path4, options);
        Stream.call(this);
        var self2 = this;
        this.path = path4;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding)
          this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self2._read();
          });
          return;
        }
        fs4.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self2.emit("error", err);
            self2.readable = false;
            return;
          }
          self2.fd = fd;
          self2.emit("open", fd);
          self2._read();
        });
      }
      function WriteStream(path4, options) {
        if (!(this instanceof WriteStream))
          return new WriteStream(path4, options);
        Stream.call(this);
        this.path = path4;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs4.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/clone.js"(exports, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf2 = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy = { __proto__: getPrototypeOf2(obj) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy;
    }
  }
});

// node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/.store/graceful-fs@4.2.11/node_modules/graceful-fs/graceful-fs.js"(exports, module2) {
    var fs4 = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop2() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop2;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs4[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs4, queue);
      fs4.close = function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs4, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      }(fs4.close);
      fs4.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs4, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      }(fs4.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs4[gracefulQueue]);
          require("assert").equal(fs4[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs4[gracefulQueue]);
    }
    module2.exports = patch(clone(fs4));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs4.__patched) {
      module2.exports = patch(fs4);
      fs4.__patched = true;
    }
    function patch(fs5) {
      polyfills(fs5);
      fs5.gracefulify = patch;
      fs5.createReadStream = createReadStream;
      fs5.createWriteStream = createWriteStream;
      var fs$readFile = fs5.readFile;
      fs5.readFile = readFile;
      function readFile(path4, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path4, options, cb);
        function go$readFile(path5, options2, cb2, startTime) {
          return fs$readFile(path5, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path5, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs5.writeFile;
      fs5.writeFile = writeFile;
      function writeFile(path4, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path4, data, options, cb);
        function go$writeFile(path5, data2, options2, cb2, startTime) {
          return fs$writeFile(path5, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path5, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs5.appendFile;
      if (fs$appendFile)
        fs5.appendFile = appendFile;
      function appendFile(path4, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path4, data, options, cb);
        function go$appendFile(path5, data2, options2, cb2, startTime) {
          return fs$appendFile(path5, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path5, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs5.copyFile;
      if (fs$copyFile)
        fs5.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs5.readdir;
      fs5.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path4, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path5, options2, cb2, startTime) {
          return fs$readdir(path5, fs$readdirCallback(
            path5,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path5, options2, cb2, startTime) {
          return fs$readdir(path5, options2, fs$readdirCallback(
            path5,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path4, options, cb);
        function fs$readdirCallback(path5, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path5, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs5);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs5.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs5.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs5, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs5, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs5, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs5, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path4, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path4, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path4, options) {
        return new fs5.ReadStream(path4, options);
      }
      function createWriteStream(path4, options) {
        return new fs5.WriteStream(path4, options);
      }
      var fs$open = fs5.open;
      fs5.open = open;
      function open(path4, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path4, flags, mode, cb);
        function go$open(path5, flags2, mode2, cb2, startTime) {
          return fs$open(path5, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path5, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs5;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs4[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs4[gracefulQueue].length; ++i) {
        if (fs4[gracefulQueue][i].length > 2) {
          fs4[gracefulQueue][i][3] = now;
          fs4[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs4[gracefulQueue].length === 0)
        return;
      var elem = fs4[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs4[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/fs/index.js"(exports) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs4 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs4[key] === "function";
    });
    Object.assign(exports, fs4);
    api.forEach((method) => {
      exports[method] = u(fs4[method]);
    });
    exports.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs4.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs4.exists(filename, resolve);
      });
    };
    exports.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs4.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs4.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs4.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs4.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs4.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs4.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs4.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs4.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs4.realpath.native === "function") {
      exports.realpath.native = u(fs4.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/mkdirs/utils.js"(exports, module2) {
    "use strict";
    var path4 = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path4.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports, module2) {
    "use strict";
    var fs4 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults2 = { mode: 511 };
      if (typeof options === "number")
        return options;
      return { ...defaults2, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs4.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs4.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/mkdirs/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/path-exists/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs4 = require_fs();
    function pathExists(path4) {
      return fs4.access(path4).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs4.existsSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/util/utimes.js"(exports, module2) {
    "use strict";
    var fs4 = require_fs();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path4, atime, mtime) {
      const fd = await fs4.open(path4, "r+");
      let closeErr = null;
      try {
        await fs4.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs4.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path4, atime, mtime) {
      const fd = fs4.openSync(path4, "r+");
      fs4.futimesSync(fd, atime, mtime);
      return fs4.closeSync(fd);
    }
    module2.exports = {
      utimesMillis: u(utimesMillis),
      utimesMillisSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/util/stat.js"(exports, module2) {
    "use strict";
    var fs4 = require_fs();
    var path4 = require("path");
    var u = require_universalify().fromPromise;
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs4.stat(file, { bigint: true }) : (file) => fs4.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT")
            return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs4.statSync(file, { bigint: true }) : (file) => fs4.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT")
          return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    async function checkPaths(src, dest, funcName, opts) {
      const { srcStat, destStat } = await getStats(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path4.basename(src);
          const destBaseName = path4.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path4.basename(src);
          const destBaseName = path4.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    async function checkParentPaths(src, srcStat, dest, funcName) {
      const srcParent = path4.resolve(path4.dirname(src));
      const destParent = path4.resolve(path4.dirname(dest));
      if (destParent === srcParent || destParent === path4.parse(destParent).root)
        return;
      let destStat;
      try {
        destStat = await fs4.stat(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT")
          return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPaths(src, srcStat, destParent, funcName);
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path4.resolve(path4.dirname(src));
      const destParent = path4.resolve(path4.dirname(dest));
      if (destParent === srcParent || destParent === path4.parse(destParent).root)
        return;
      let destStat;
      try {
        destStat = fs4.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT")
          return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path4.resolve(src).split(path4.sep).filter((i) => i);
      const destArr = path4.resolve(dest).split(path4.sep).filter((i) => i);
      return srcArr.every((cur, i) => destArr[i] === cur);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      // checkPaths
      checkPaths: u(checkPaths),
      checkPathsSync,
      // checkParent
      checkParentPaths: u(checkParentPaths),
      checkParentPathsSync,
      // Misc
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/copy/copy.js"(exports, module2) {
    "use strict";
    var fs4 = require_fs();
    var path4 = require("path");
    var { mkdirs } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { utimesMillis } = require_utimes();
    var stat = require_stat();
    async function copy(src, dest, opts = {}) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      const { srcStat, destStat } = await stat.checkPaths(src, dest, "copy", opts);
      await stat.checkParentPaths(src, srcStat, dest, "copy");
      const include = await runFilter(src, dest, opts);
      if (!include)
        return;
      const destParent = path4.dirname(dest);
      const dirExists = await pathExists(destParent);
      if (!dirExists) {
        await mkdirs(destParent);
      }
      await getStatsAndPerformCopy(destStat, src, dest, opts);
    }
    async function runFilter(src, dest, opts) {
      if (!opts.filter)
        return true;
      return opts.filter(src, dest);
    }
    async function getStatsAndPerformCopy(destStat, src, dest, opts) {
      const statFn = opts.dereference ? fs4.stat : fs4.lstat;
      const srcStat = await statFn(src);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts);
      if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts);
      if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts);
      if (srcStat.isSocket())
        throw new Error(`Cannot copy a socket file: ${src}`);
      if (srcStat.isFIFO())
        throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    async function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts);
      if (opts.overwrite) {
        await fs4.unlink(dest);
        return copyFile(srcStat, src, dest, opts);
      }
      if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src, dest, opts) {
      await fs4.copyFile(src, dest);
      if (opts.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs4.stat(src);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs4.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs4.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) {
        await fs4.mkdir(dest);
      }
      const items = await fs4.readdir(src);
      await Promise.all(items.map(async (item) => {
        const srcItem = path4.join(src, item);
        const destItem = path4.join(dest, item);
        const include = await runFilter(srcItem, destItem, opts);
        if (!include)
          return;
        const { destStat: destStat2 } = await stat.checkPaths(srcItem, destItem, "copy", opts);
        return getStatsAndPerformCopy(destStat2, srcItem, destItem, opts);
      }));
      if (!destStat) {
        await fs4.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src, dest, opts) {
      let resolvedSrc = await fs4.readlink(src);
      if (opts.dereference) {
        resolvedSrc = path4.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs4.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs4.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN")
          return fs4.symlink(resolvedSrc, dest);
        throw e;
      }
      if (opts.dereference) {
        resolvedDest = path4.resolve(process.cwd(), resolvedDest);
      }
      if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
        throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
      }
      if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
        throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
      }
      await fs4.unlink(dest);
      return fs4.symlink(resolvedSrc, dest);
    }
    module2.exports = copy;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/copy/copy-sync.js"(exports, module2) {
    "use strict";
    var fs4 = require_graceful_fs();
    var path4 = require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat = require_stat();
    function copySync3(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      if (opts.filter && !opts.filter(src, dest))
        return;
      const destParent = path4.dirname(dest);
      if (!fs4.existsSync(destParent))
        mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs4.statSync : fs4.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket())
        throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO())
        throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs4.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs4.copyFileSync(src, dest);
      if (opts.preserveTimestamps)
        handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode))
        makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs4.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs4.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs4.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      fs4.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path4.join(src, item);
      const destItem = path4.join(dest, item);
      if (opts.filter && !opts.filter(srcItem, destItem))
        return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
      return getStats(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs4.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path4.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs4.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs4.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN")
            return fs4.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path4.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs4.unlinkSync(dest);
      return fs4.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync3;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/copy/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    module2.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/remove/index.js"(exports, module2) {
    "use strict";
    var fs4 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path4, callback) {
      fs4.rm(path4, { recursive: true, force: true }, callback);
    }
    function removeSync4(path4) {
      fs4.rmSync(path4, { recursive: true, force: true });
    }
    module2.exports = {
      remove: u(remove),
      removeSync: removeSync4
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/empty/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs4 = require_fs();
    var path4 = require("path");
    var mkdir = require_mkdirs();
    var remove = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs4.readdir(dir);
      } catch (e) {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path4.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs4.readdirSync(dir);
      } catch (e) {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path4.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/file.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path4 = require("path");
    var fs4 = require_fs();
    var mkdir = require_mkdirs();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs4.stat(file);
      } catch (e) {
      }
      if (stats && stats.isFile())
        return;
      const dir = path4.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs4.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs4.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs4.writeFile(file, "");
      } else {
        await fs4.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs4.statSync(file);
      } catch (e) {
      }
      if (stats && stats.isFile())
        return;
      const dir = path4.dirname(file);
      try {
        if (!fs4.statSync(dir).isDirectory()) {
          fs4.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT")
          mkdir.mkdirsSync(dir);
        else
          throw err;
      }
      fs4.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/link.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path4 = require("path");
    var fs4 = require_fs();
    var mkdir = require_mkdirs();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs4.lstat(dstpath);
      } catch (e) {
      }
      let srcStat;
      try {
        srcStat = await fs4.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      if (dstStat && areIdentical(srcStat, dstStat))
        return;
      const dir = path4.dirname(dstpath);
      const dirExists = await pathExists(dir);
      if (!dirExists) {
        await mkdir.mkdirs(dir);
      }
      await fs4.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs4.lstatSync(dstpath);
      } catch (e) {
      }
      try {
        const srcStat = fs4.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat))
          return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path4.dirname(dstpath);
      const dirExists = fs4.existsSync(dir);
      if (dirExists)
        return fs4.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs4.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports, module2) {
    "use strict";
    var path4 = require("path");
    var fs4 = require_fs();
    var { pathExists } = require_path_exists();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path4.isAbsolute(srcpath)) {
        try {
          await fs4.lstat(srcpath);
        } catch (err) {
          err.message = err.message.replace("lstat", "ensureSymlink");
          throw err;
        }
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path4.dirname(dstpath);
      const relativeToDst = path4.join(dstdir, srcpath);
      const exists = await pathExists(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      try {
        await fs4.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        throw err;
      }
      return {
        toCwd: srcpath,
        toDst: path4.relative(dstdir, srcpath)
      };
    }
    function symlinkPathsSync(srcpath, dstpath) {
      if (path4.isAbsolute(srcpath)) {
        const exists2 = fs4.existsSync(srcpath);
        if (!exists2)
          throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path4.dirname(dstpath);
      const relativeToDst = path4.join(dstdir, srcpath);
      const exists = fs4.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs4.existsSync(srcpath);
      if (!srcExists)
        throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path4.relative(dstdir, srcpath)
      };
    }
    module2.exports = {
      symlinkPaths: u(symlinkPaths),
      symlinkPathsSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports, module2) {
    "use strict";
    var fs4 = require_fs();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type)
        return type;
      let stats;
      try {
        stats = await fs4.lstat(srcpath);
      } catch (e) {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type)
        return type;
      let stats;
      try {
        stats = fs4.lstatSync(srcpath);
      } catch (e) {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType: u(symlinkType),
      symlinkTypeSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/symlink.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path4 = require("path");
    var fs4 = require_fs();
    var { mkdirs, mkdirsSync } = require_mkdirs();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths();
    var { symlinkType, symlinkTypeSync } = require_symlink_type();
    var { pathExists } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs4.lstat(dstpath);
      } catch (e) {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs4.stat(srcpath),
          fs4.stat(dstpath)
        ]);
        if (areIdentical(srcStat, dstStat))
          return;
      }
      const relative = await symlinkPaths(srcpath, dstpath);
      srcpath = relative.toDst;
      const toType = await symlinkType(relative.toCwd, type);
      const dir = path4.dirname(dstpath);
      if (!await pathExists(dir)) {
        await mkdirs(dir);
      }
      return fs4.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs4.lstatSync(dstpath);
      } catch (e) {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs4.statSync(srcpath);
        const dstStat = fs4.statSync(dstpath);
        if (areIdentical(srcStat, dstStat))
          return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path4.dirname(dstpath);
      const exists = fs4.existsSync(dir);
      if (exists)
        return fs4.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs4.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/ensure/index.js"(exports, module2) {
    "use strict";
    var { createFile, createFileSync } = require_file();
    var { createLink, createLinkSync } = require_link();
    var { createSymlink, createSymlinkSync } = require_symlink();
    module2.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// node_modules/.store/jsonfile@6.1.0/node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "node_modules/.store/jsonfile@6.1.0/node_modules/jsonfile/utils.js"(exports, module2) {
    function stringify(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF = finalEOL ? EOL : "";
      const str = JSON.stringify(obj, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF;
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content))
        content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module2.exports = { stringify, stripBom };
  }
});

// node_modules/.store/jsonfile@6.1.0/node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/.store/jsonfile@6.1.0/node_modules/jsonfile/index.js"(exports, module2) {
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = require("fs");
    }
    var universalify = require_universalify();
    var { stringify, stripBom } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs4 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs4.readFile)(file, options);
      data = stripBom(data);
      let obj;
      try {
        obj = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj;
    }
    var readFile = universalify.fromPromise(_readFile);
    function readFileSync3(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs4 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs4.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj, options = {}) {
      const fs4 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs4.writeFile)(file, str, options);
    }
    var writeFile = universalify.fromPromise(_writeFile);
    function writeFileSync3(file, obj, options = {}) {
      const fs4 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs4.writeFileSync(file, str, options);
    }
    var jsonfile = {
      readFile,
      readFileSync: readFileSync3,
      writeFile,
      writeFileSync: writeFileSync3
    };
    module2.exports = jsonfile;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/jsonfile.js"(exports, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/output-file/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs4 = require_fs();
    var path4 = require("path");
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path4.dirname(file);
      if (!await pathExists(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs4.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path4.dirname(file);
      if (!fs4.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs4.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/output-json.js"(exports, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile } = require_output_file();
    async function outputJson(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile(file, str, options);
    }
    module2.exports = outputJson;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/output-json-sync.js"(exports, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync } = require_output_file();
    function outputJsonSync2(file, data, options) {
      const str = stringify(data, options);
      outputFileSync(file, str, options);
    }
    module2.exports = outputJsonSync2;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/json/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/move/move.js"(exports, module2) {
    "use strict";
    var fs4 = require_fs();
    var path4 = require("path");
    var { copy } = require_copy2();
    var { remove } = require_remove();
    var { mkdirp } = require_mkdirs();
    var { pathExists } = require_path_exists();
    var stat = require_stat();
    async function move(src, dest, opts = {}) {
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = await stat.checkPaths(src, dest, "move", opts);
      await stat.checkParentPaths(src, srcStat, dest, "move");
      const destParent = path4.dirname(dest);
      const parsedParentPath = path4.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src, dest, overwrite, isChangingCase);
    }
    async function doRename(src, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove(dest);
        } else if (await pathExists(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs4.rename(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") {
          throw err;
        }
        await moveAcrossDevice(src, dest, overwrite);
      }
    }
    async function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      await copy(src, dest, opts);
      return remove(src);
    }
    module2.exports = move;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/move/move-sync.js"(exports, module2) {
    "use strict";
    var fs4 = require_graceful_fs();
    var path4 = require("path");
    var copySync3 = require_copy2().copySync;
    var removeSync4 = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest))
        mkdirpSync(path4.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path4.dirname(dest);
      const parsedPath = path4.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase)
        return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync4(dest);
        return rename(src, dest, overwrite);
      }
      if (fs4.existsSync(dest))
        throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs4.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV")
          throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync3(src, dest, opts);
      return removeSync4(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/move/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    module2.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "node_modules/.store/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      // Export promiseified graceful-fs:
      ...require_fs(),
      // Export extra methods:
      ...require_copy2(),
      ...require_empty(),
      ...require_ensure(),
      ...require_json(),
      ...require_mkdirs(),
      ...require_move2(),
      ...require_output_file(),
      ...require_path_exists(),
      ...require_remove()
    };
  }
});

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);

// src/main.ts
var path3 = __toESM(require("path"));
var fs3 = __toESM(require_lib());
var import_obsidian22 = require("obsidian");

// src/settings/data.ts
var DEFAULT_SETTINGS = {
  I18N_UUID: "",
  I18N_WIZARD: true,
  I18N_LANGUAGE: "zh-cn",
  I18N_MODE_LDT: true,
  I18N_MODE_NDT: false,
  I18N_MODE_NIT: false,
  // 签字
  I18N_AUTHOR: "",
  // 自动更新
  I18N_AUTOMATIC_UPDATE: false,
  // 译文编辑
  I18N_EDIT_MODE: true,
  // 打开设置
  I18N_OPEN_SETTINGS: false,
  // 译文提交
  I18N_SUBMIT_TRANSLATION_MODE: true,
  // 译文求译
  I18N_REQUEST_TRANSLATION_MODE: false,
  // 忽略插件
  I18N_IGNORE: true,
  // 匹配模式配置
  I18N_RE_MODE: "\u9ED8\u8BA4",
  I18N_RE_FLAGS: "gs",
  I18N_RE_LENGTH: 300,
  I18N_RE_MODE_EDIT: false,
  I18N_RE_MODE_DISPLAY: false,
  I18N_RE_DATAS_DISPLAY: false,
  I18N_RE_MODES: ["\u9ED8\u8BA4"],
  I18N_RE_DATAS: {
    "\u9ED8\u8BA4": [
      "Notice\\(\\s*(.+?)\\s*\\)/gs",
      ".setText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
      ".setButtonText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
      ".setName\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
      ".setDesc\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
      ".setPlaceholder\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
      ".setTooltip\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
      ".appendText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
      ".createEl\\((['\"`])([\\w:-]+)\\1,\\s*\\{\\s*text:\\s*(['\"`])(.+?)\\3\\s*\\}\\s*\\)",
      ".innerText\\s*=\\s*(['\"`]).*?\\1"
    ]
  },
  // 网络文件配置
  I18N_NDT_APIS_DISPLAY: false,
  I18N_NDT_APIS: {
    "zh-cn": "https://gitee.com/zero--two/obsidian-i18n-translation/raw/master/zh-cn/"
  },
  // 网络接口配置
  I18N_NIT_API: "BAIDU",
  I18N_NIT_API_INTERVAL: 500,
  I18N_NIT_APIS: {
    BAIDU: {
      FROM: "auto",
      TO: "zh",
      APP_ID: "",
      KEY: ""
    }
  },
  I18N_NIT_OPENAI_URL: "https://api.openai.com",
  I18N_NIT_OPENAI_KEY: "",
  I18N_NIT_OPENAI_MODEL: "gpt-3.5-turbo",
  I18N_NIT_OPENAI_TIPS: "\u4F60\u662F\u4E00\u4E2A\u7FFB\u8BD1\u5DE5\u4F5C\u8005\uFF0C\u4F60\u5C06\u8FDB\u884Cobsidian\u7B14\u8BB0\u8F6F\u4EF6\u7684\u63D2\u4EF6\u7FFB\u8BD1\uFF0C\u672C\u6B21\u7FFB\u8BD1\u7684\u63D2\u4EF6\u540D\u79F0\u4E3A: ${plugin}\uFF0C\u8BF7\u7ED3\u5408\u63D2\u4EF6\u540D\u79F0\u4EE5\u53CA\u8F6F\u4EF6\u7FFB\u8BD1\u7684\u6807\u51C6\u8FDB\u884C\u540E\u7EED\u5DE5\u4F5C\uFF0C\u56E0\u4E3A\u5927\u591A\u6570\u6587\u672C\u957F\u5EA6\u8F83\u77ED\uFF0C\u8BF7\u4EE5\u7B26\u5408\u4E2D\u6587\u4E60\u60EF\u7684\u65B9\u5F0F\u7FFB\u8BD1\u3002\u63A5\u4E0B\u6765\u6211\u4F1A\u63D0\u4EA4\u7ED9\u4F60\u5F88\u591A\u82F1\u6587\u6587\u672C\uFF0C\u8BF7\u5C06\u5176\u7FFB\u8BD1\u4E3A\u7B80\u4F53\u4E2D\u6587\uFF0C\u5E76\u4E14\u53EA\u8FD4\u56DE\u7ED9\u6211\u7FFB\u8BD1\u540E\u7684\u5185\u5BB9",
  I18N_SEARCH_TEXT: "",
  I18N_SORT: "0",
  I18N_TYPE: "0"
};

// src/settings/ui/index.ts
var import_obsidian18 = require("obsidian");

// src/settings/ui/i18n-help.ts
var import_obsidian2 = require("obsidian");

// src/settings/ui/base-setting.ts
var BaseSetting = class {
  constructor(obj) {
    this.settingTab = obj;
    this.i18n = obj.i18n;
    this.settings = obj.i18n.settings;
    this.containerEl = obj.containerEl;
    this.app = obj.app;
  }
  display() {
    this.main();
  }
};

// src/utils.ts
var fs = __toESM(require_lib());
var import_obsidian = require("obsidian");
var State = class {
  constructor(path4) {
    this.stateJson = {
      "state": false,
      "pluginVersion": "",
      "translationVersion": ""
    };
    this.path = path4;
  }
  /**
   * 判断状态文件是否存在
   * @returns 返回状态文件是否存在
   */
  isState() {
    try {
      return fs.pathExistsSync(this.path);
    } catch (error) {
      new import_obsidian.Notice(`\u26A0 ${error}`);
      console.error(`\u26A0 ${error}`);
    }
  }
  // 增
  insert() {
    try {
      fs.outputJsonSync(this.path, this.stateJson);
    } catch (error) {
      new import_obsidian.Notice(`\u26A0 ${error}`);
      console.error(`\u26A0 ${error}`);
    }
  }
  // 删
  delete() {
    try {
      fs.removeSync(this.path);
    } catch (error) {
      new import_obsidian.Notice(`\u26A0 ${error}`);
      console.error(`\u26A0 ${error}`);
    }
  }
  // 改
  update(is_i18n, pluginVersion, translationVersion) {
    const state = {
      "state": is_i18n,
      "pluginVersion": pluginVersion,
      "translationVersion": translationVersion
    };
    try {
      fs.outputJsonSync(this.path, state);
    } catch (error) {
      new import_obsidian.Notice(`\u26A0 ${error}`);
      console.error(`\u26A0 ${error}`);
    }
  }
  // 查
  select() {
    try {
      return fs.readJsonSync(this.path);
    } catch (error) {
      new import_obsidian.Notice(`\u26A0 ${error}`);
      console.error(`\u26A0 ${error}`);
    }
  }
  // [重置]
  reset() {
    try {
      fs.outputJsonSync(this.path, this.stateJson);
    } catch (error) {
      new import_obsidian.Notice(`\u26A0 ${error}`);
      console.error(`\u26A0 ${error}`);
    }
  }
  state() {
    return this.select().state;
  }
  pluginVersion() {
    return this.select().pluginVersion;
  }
  translationVersion() {
    return this.select().translationVersion;
  }
};
function generateTranslation(id, author, version, pluginVersion, manifestJSON, mainStr, reLength, regexps, flags) {
  const description = manifestJSON.description;
  const translationJson = {
    "manifest": {
      "id": id,
      "author": author == "" ? "\u65E0\u540D\u6C0F" : author,
      "version": version,
      "pluginVersion": pluginVersion
    },
    "description": {
      "original": description,
      "translation": description
    },
    "dict": {}
  };
  for (let i = 0; i < regexps.length; i++) {
    const temp_array = mainStr.match(new RegExp(regexps[i], flags));
    if (temp_array != null) {
      for (const i2 in temp_array)
        if (temp_array[i2].length <= reLength)
          translationJson.dict[temp_array[i2]] = temp_array[i2];
    }
  }
  return translationJson;
}
function PNotice(prefix, text) {
  new import_obsidian.Notice(`[${prefix}] ${text}`);
}
function NoticeInfo(prefix, text, duration = 4e3) {
  const hasClass = document.body ? document.body.classList.contains("theme-dark") : false;
  new import_obsidian.Notice(`[${prefix}] ${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? "dark" : "light"}_info`);
}
function NoticeWarning(prefix, text, duration = 4e3) {
  const hasClass = document.body ? document.body.classList.contains("theme-dark") : false;
  new import_obsidian.Notice(`[${prefix}] ${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? "dark" : "light"}_warning`);
}
function NoticeError(prefix, text, duration = 1e4) {
  const hasClass = document.body ? document.body.classList.contains("theme-dark") : false;
  new import_obsidian.Notice(`[${prefix}] ${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? "dark" : "light"}_error`);
}
function NoticeOperationResult(prefix, isSuccess, text = "") {
  const hasClass = document.body ? document.body.classList.contains("theme-dark") : false;
  if (isSuccess) {
    if (text != "") {
      new import_obsidian.Notice(`[${prefix}] \u6210\u529F
${text}`, 4e3).noticeEl.addClass(`i18n_notice_${hasClass ? "dark" : "light"}_success`);
    } else {
      new import_obsidian.Notice(`[${prefix}] \u6210\u529F`, 4e3).noticeEl.addClass(`i18n_notice_${hasClass ? "dark" : "light"}_success`);
    }
  } else {
    new import_obsidian.Notice(`[${prefix}] \u5931\u8D25
${text}`, 1e4).noticeEl.addClass(`i18n_notice_${hasClass ? "dark" : "light"}_error`);
  }
}

// src/url.ts
var Url = class {
};
Url.I18N_ICON = "https://gitee.com/zero--two/obsidian-i18n-translation/raw/master/Obsidian.png";
Url.QQ_GROUP = "https://qm.qq.com/cgi-bin/qm/qr?k=kHTS0iC1FC5igTXbdbKzff6_tc54mOF5&jump_from=webapi&authKey=AoSkriW+nDeDzBPqBl9jcpbAYkPXN2QRbrMh0hFbvMrGbqZyRAbJwaD6JKbOy4Nx";
Url.VIDEO_TUTORIAL = "https://www.bilibili.com/video/BV1c8pveSEhC/?spm_id_from=333.788&vd_source=2c97c1473176b942c0ed5ffe9cbb05b1";
Url.DOCUMENTATION_TUTORIAL = "https://github.com/0011000000110010/obsidian-i18n/wiki/%E5%9F%BA%E7%A1%80%E6%93%8D%E4%BD%9C";

// src/settings/ui/i18n-help.ts
var I18nHelp = class extends BaseSetting {
  main() {
    const I18nHelp2 = new import_obsidian2.Setting(this.containerEl);
    I18nHelp2.setName("\u5E2E\u52A9");
    I18nHelp2.addButton(
      (cb) => cb.setButtonText("\u9E23\u8C22").onClick(() => {
        PNotice("\u6587\u6863", "\ndangehub");
        PNotice("\u5EFA\u8BAE", "\ncuberwu");
        PNotice("\u8BD1\u6587", "\nFENDI");
      })
    );
    I18nHelp2.addButton(
      (cb) => cb.setButtonText("\u6587\u6863").onClick(() => {
        window.open(Url.DOCUMENTATION_TUTORIAL);
      })
    );
  }
};

// src/settings/ui/i18n-language.ts
var import_obsidian4 = require("obsidian");

// src/data/data.ts
var LANGUAGES = {
  "zh-cn": "\u7B80\u4F53\u4E2D\u6587",
  "zh-tw": "\u7E41\u9AD4\u4E2D\u6587",
  "en": "English",
  "ru": "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
  "custom ": "\u81EA\u5B9A\u4E49"
};
var API_TYPES = {
  "BAIDU": "\u767E\u5EA6",
  "OPENAI": "OpenAI"
};
var BAIDU_ERROR_CODE = {
  "52000": "\u6210\u529F",
  "52001": "\u8BF7\u6C42\u8D85\u65F6",
  "52002": "\u7CFB\u7EDF\u9519\u8BEF",
  "52003": "\u672A\u6388\u6743\u7528\u6237",
  "54000": "\u5FC5\u586B\u53C2\u6570\u4E3A\u7A7A",
  "54001": "\u7B7E\u540D\u9519\u8BEF",
  "54003": "\u8BBF\u95EE\u9891\u7387\u53D7\u9650",
  "54004": "\u8D26\u6237\u4F59\u989D\u4E0D\u8DB3",
  "54005": "\u957Fquery\u8BF7\u6C42\u9891\u7E41",
  "58000": "\u5BA2\u6237\u7AEFIP\u975E\u6CD5",
  "58001": "\u8BD1\u6587\u8BED\u8A00\u65B9\u5411\u4E0D\u652F\u6301",
  "58002": "\u670D\u52A1\u5F53\u524D\u5DF2\u5173\u95ED",
  "58003": "\u6B64IP\u5DF2\u88AB\u5C01\u7981",
  "90107": "\u8BA4\u8BC1\u672A\u901A\u8FC7\u6216\u672A\u751F\u6548",
  "20003": "\u8BF7\u6C42\u5185\u5BB9\u5B58\u5728\u5B89\u5168\u98CE\u9669 "
};
var I18N_SORT = {
  "0": "\u6B63\u5E8F",
  "1": "\u5012\u5E8F"
};
var I18N_TYPE = {
  "0": "\u5168\u90E8",
  "1": "\u63D0\u53D6",
  "2": "\u7FFB\u8BD1",
  "3": "\u8FD8\u539F"
};

// src/lang/inxdex.ts
var import_obsidian3 = require("obsidian");

// src/lang/locale/zh-cn.ts
var zh_cn_default = {
  LANGUAGE: "\u8BED\u8A00",
  I18N_RIBBON_TITLE: "\u63D2\u4EF6\u5217\u8868",
  I18N_VERSION_TITLE: "\u7248\u672C",
  BATCH_TITLE: "\u6279\u91CF",
  BATCH_TRENSLATOR_TEXT: "\u7FFB\u8BD1",
  BATCH_TRENSLATOR_TOOLTIP: "\u6279\u91CF\u7FFB\u8BD1\u63D2\u4EF6",
  BATCH_TRENSLATOR_NPTICE: "\u7FFB\u8BD1\u5B8C\u6210",
  BATCH_TRENSLATOR_NPTICE_2: "[\u6279\u91CF\u7FFB\u8BD1] \u91CD\u542F Obsidian \u751F\u6548",
  BATCH_RESTORE_TEXT: "\u8FD8\u539F",
  BATCH_RESTORE_TOOLTIP: "\u6279\u91CF\u8FD8\u539F\u63D2\u4EF6",
  BATCH_RESTORE_NPTICE: "\u8FD8\u539F\u5B8C\u6210",
  BATCH_RESTORE_NPTICE_2: "[\u6279\u91CF\u8FD8\u539F] \u91CD\u542F Obsidian \u751F\u6548",
  BATCH_GENERATE_TEXT: "\u751F\u6210",
  BATCH_GENERATE_TOOLTIP: "\u6279\u91CF\u751F\u6210\u63D2\u4EF6\u8BD1\u6587",
  BATCH_GENERATE_NPTICE: "\u751F\u6210\u5B8C\u6210",
  BATCH_GENERATE_NPTICE_2: "[\u6279\u91CF\u751F\u6210] \u751F\u6210\u5B8C\u6210 \u8BF7\u524D\u5F80\u63D2\u4EF6\u76EE\u5F55\u8FDB\u884C\u624B\u52A8\u7FFB\u8BD1\u5DE5\u4F5C",
  BATCH_DELETE_TEXT: "\u5220\u9664",
  BATCH_DELETE_TOOLTIP: "\u6279\u91CF\u5220\u9664\u63D2\u4EF6\u8BD1\u6587",
  BATCH_DELETE_NPTICE: "\u5220\u9664\u5B8C\u6210",
  BATCH_DELETE_NPTICE_2: "[\u6279\u91CF\u5220\u9664] \u91CD\u542F Obsidian \u751F\u6548",
  OPEN_PLUGINDIR_TOOLTIP: "\u6253\u5F00\u63D2\u4EF6\u76EE\u5F55",
  DELETE_PLUGINDIR_TEXT: "\u5220\u9664",
  DELETE_PLUGINDIR_TOOLTIP: "\u6E05\u9664\u7FFB\u8BD1\u6587\u4EF6",
  DELETE_PLUGINDIR_NPTICE: "\u5220\u9664\u5B8C\u6210",
  DELETE_PLUGINDIR_NPTICE_2: "\u91CD\u542F Obsidian \u751F\u6548",
  LDT_GENERATE_TEXT: "\u751F\u6210",
  LDT_GENERATE_TOOLTIP: "\u751F\u6210\u672A\u7FFB\u8BD1\u8BD1\u6587",
  LDT_GENERATE_NPTICE: "\u751F\u6210\u5B8C\u6210 \u8BF7\u524D\u5F80\u63D2\u4EF6\u76EE\u5F55\u8FDB\u884C\u624B\u52A8\u7FFB\u8BD1\u5DE5\u4F5C",
  NDT_DOWNLOAD_TEXT: "\u4E0B\u8F7D",
  NDT_DOWNLOAD_TOOLTIP: "\u4ECE\u7F51\u7EDC\u4E0B\u8F7D\u8BD1\u6587",
  NDT_UPDATE_TEXT: "\u66F4\u65B0",
  NDT_UPDATE_TOOLTIP: "\u5BF9\u672C\u5730\u8BD1\u6587\u8FDB\u884C\u66F4\u65B0",
  NIT_GENERATE_TEXT: "\u751F\u6210",
  NIT_GENERATE_TOOLTIP: "\u751F\u6210\u5DF2\u7FFB\u8BD1\u8BD1\u6587",
  NIT_GENERATE_NPTICE: "\u751F\u6210\u4E2D",
  TRANSLATE_TEXT: "\u7FFB\u8BD1",
  TRANSLATE_TOOLTIP: "\u5BF9\u63D2\u4EF6\u8FDB\u884C\u7FFB\u8BD1",
  TRANSLATE_NPTICE: "\u91CD\u542F Obsidian \u751F\u6548",
  RESTORE_TEXT: "\u8FD8\u539F",
  RESTORE_TOOLTIP: "\u5BF9\u63D2\u4EF6\u8FDB\u884C\u8FD8\u539F",
  RESTORE_NPTICE: "\u91CD\u542F Obsidian \u751F\u6548",
  RESTORE_NPTICE_2: "\u8FD8\u539F\u5B8C\u6210",
  SETTING_BASE_TITLE: "\u57FA\u7840\u8BBE\u7F6E",
  SETTING_LANGUAGE: "\u8BED\u8A00",
  SETTING_LANGUAGE_DESC: "\u9009\u62E9\u9700\u8981\u7FFB\u8BD1\u7684\u8BED\u8A00",
  SETTING_LOG: "\u65E5\u5FD7",
  SETTING_LOG_DESC: "\u662F\u5426\u5F00\u542F\u65E5\u5FD7\u8C03\u8BD5(Ctrl + Shift + I)",
  SETTING_BATCH: "\u6279\u91CF",
  SETTING_BATCH_DESC: "\u662F\u5426\u5F00\u542F\u6279\u91CF\u64CD\u4F5C",
  SETTING_LDT_TITLE: "\u672C\u5730\u6587\u4EF6\u6A21\u5F0F",
  SETTING_LDT_MODE: "\u6A21\u5F0F",
  SETTING_LDT_MODE_DESC: "\u5F00\u542F\u672C\u5730\u6587\u4EF6\u6A21\u5F0F \u5C06\u4F1A\u5F00\u542F\u7FFB\u8BD1\u8FD8\u539F\u751F\u6210\u529F\u80FD",
  SETTING_LDT_GENERATE: "\u751F\u6210",
  SETTING_LDT_GENERATE_DESC: "\u5F00\u542F\u672C\u5730\u8BD1\u6587\u81EA\u52A8\u751F\u6210\u529F\u80FD",
  SETTING_NDT_TITLE: "\u7F51\u7EDC\u6587\u4EF6\u6A21\u5F0F",
  SETTING_NDT_MODE: "\u6A21\u5F0F",
  SETTING_NDT_MODE_DESC: "\u5F00\u542F\u7F51\u7EDC\u6587\u4EF6\u6A21\u5F0F \u5C06\u4F1A\u4ECE\u7F51\u7EDC\u4E0B\u8F7D\u8BD1\u6587",
  SETTING_NDT_APIS: "\u63A5\u53E3",
  SETTING_NDT_APIS_DESC: "\u8BF7\u8F93\u5165\u60A8\u8981\u7FFB\u8BD1\u8BED\u8A00\u5BF9\u5E94\u7684API(\u91CD\u65B0\u6DFB\u52A0\u5C06\u4F1A\u8986\u76D6)",
  SETTING_NDT_API_ADD: "\u6DFB\u52A0",
  SETTING_NDT_NPTICE: "[\u7F51\u7EDC\u8BD1\u6587\u6A21\u5F0F] \u5F53\u524D\u8BED\u8A00 API \u4E0D\u5B58\u5728",
  SETTING_NIT_TITLE: "\u7F51\u7EDC\u63A5\u53E3\u6A21\u5F0F",
  SETTING_NIT_MODE: "\u6A21\u5F0F",
  SETTING_NIT_MODE_DESC: "\u5F00\u542F\u7F51\u7EDC\u63A5\u53E3\u6A21\u5F0F \u5C06\u4F1A\u4ECE\u7F51\u7EDCAPI\u7FFB\u8BD1\u6587\u672C",
  SETTING_NIT_APIS: "\u63A5\u53E3",
  SETTING_NIT_APIS_DESC: "\u9009\u62E9\u60A8\u8981\u4F7F\u7528\u7684\u63A5\u53E3",
  SETTING_NIT_BAIDU: "\u767E\u5EA6",
  SETTING_NIT_BAIDU_DESC: "\u57FA\u4E8E\u767E\u5EA6API\u8FDB\u884C\u7FFB\u8BD1"
};

// src/lang/inxdex.ts
var localeMap = {
  "zh-cn": zh_cn_default
  // 'zh-tw': ,
  // 'en-gb': ,
};
var locale = localeMap[import_obsidian3.moment.locale()];
function t(str) {
  return locale && locale[str] || zh_cn_default[str];
}

// src/settings/ui/i18n-language.ts
var I18nLanguage = class extends BaseSetting {
  main() {
    const i18nLanguage = new import_obsidian4.Setting(this.containerEl);
    i18nLanguage.setName(t("SETTING_LANGUAGE"));
    i18nLanguage.setDesc(t("SETTING_LANGUAGE_DESC"));
    i18nLanguage.addDropdown(
      (cb) => cb.addOptions(LANGUAGES).setValue(this.settings.I18N_LANGUAGE).onChange(async (value) => {
        this.settings.I18N_LANGUAGE = value;
        await this.i18n.saveSettings();
      })
    );
  }
};

// src/settings/ui/i18n-mod-ldt.ts
var import_obsidian5 = require("obsidian");
var I18nModLDT = class extends BaseSetting {
  main() {
    const i18nModLDT = new import_obsidian5.Setting(this.containerEl);
    i18nModLDT.setClass("bold");
    i18nModLDT.setName("\u672C\u5730\u6587\u4EF6\u6A21\u5F0F");
    i18nModLDT.setDesc("");
    i18nModLDT.addToggle(
      (cb) => cb.setValue(this.settings.I18N_MODE_LDT).onChange(() => {
        this.settings.I18N_MODE_LDT = !this.settings.I18N_MODE_LDT;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
  }
};

// src/settings/ui/i18n-mod-ndt.ts
var import_obsidian6 = require("obsidian");
var I18nModNDT = class extends BaseSetting {
  main() {
    const i18nModNDT = new import_obsidian6.Setting(this.containerEl);
    i18nModNDT.setClass("bold");
    i18nModNDT.setName("\u4E91\u7AEF\u6587\u4EF6\u6A21\u5F0F");
    i18nModNDT.setDesc("");
    i18nModNDT.addToggle(
      (cb) => cb.setValue(this.settings.I18N_MODE_NDT).onChange(async () => {
        this.settings.I18N_MODE_NDT = !this.settings.I18N_MODE_NDT;
        await this.i18n.saveSettings();
        const id = this.i18n.manifest.id;
        const settings = this.app.setting;
        await this.app.plugins.disablePlugin(id);
        await this.app.plugins.enablePlugin(id);
        settings.close();
      })
    );
  }
};

// src/settings/ui/i18n-ndt-api.ts
var import_obsidian7 = require("obsidian");
var I18nNdtApi = class extends BaseSetting {
  main() {
    let temp_ndt_lang = "";
    let temp_ndt_url = "";
    const i18nNdtApis = new import_obsidian7.Setting(this.containerEl);
    if (!this.settings.I18N_MODE_NDT)
      i18nNdtApis.setClass("i18n_display-none");
    i18nNdtApis.setName(t("SETTING_NDT_APIS"));
    i18nNdtApis.setDesc(t("SETTING_NDT_APIS_DESC"));
    i18nNdtApis.addDropdown(
      (cb) => cb.addOptions(LANGUAGES).setValue("").onChange(async (value) => {
        temp_ndt_lang = value;
      })
    );
    i18nNdtApis.addText(
      (cb) => cb.setPlaceholder("URL").onChange((value) => {
        temp_ndt_url = value;
      })
    );
    i18nNdtApis.addButton(
      (cb) => cb.setButtonText(t("SETTING_NDT_API_ADD")).onClick(() => {
        if (temp_ndt_lang != "" && temp_ndt_url != "") {
          this.settings.I18N_NDT_APIS[temp_ndt_lang] = temp_ndt_url;
          this.i18n.saveSettings();
          this.settingTab.display();
        }
      })
    );
    i18nNdtApis.addButton(
      (cb) => cb.setButtonText(this.settings.I18N_NDT_APIS_DISPLAY ? "\u9690\u85CF" : "\u67E5\u770B").onClick(() => {
        this.settings.I18N_NDT_APIS_DISPLAY = !this.settings.I18N_NDT_APIS_DISPLAY;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
    if (this.settings.I18N_NDT_APIS_DISPLAY) {
      for (const key in this.settings.I18N_NDT_APIS) {
        const i18nNDTURL = new import_obsidian7.Setting(this.containerEl);
        i18nNDTURL.setName(key);
        i18nNDTURL.setDesc(this.settings.I18N_NDT_APIS[key]);
        i18nNDTURL.addButton(
          (cb) => cb.setIcon("trash").onClick(() => {
            delete this.settings.I18N_NDT_APIS[key];
            this.i18n.saveSettings();
            this.settingTab.display();
          })
        );
      }
    }
  }
};

// src/settings/ui/i18n-mod-nit.ts
var import_obsidian9 = require("obsidian");

// src/api.ts
var path = __toESM(require("path"));
var import_crypto = require("crypto");
var import_obsidian8 = require("obsidian");

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction(val.pipe);
var isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
var isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {
};
var toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
var ALPHA = "abcdefghijklmnopqrstuvwxyz";
var DIGIT = "0123456789";
var ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
var toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({ source, data }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === "function",
  isFunction(_global.postMessage)
);
var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/AxiosError.js
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
var prototype = AxiosError.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/null.js
var null_default = null;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path4, key, dots) {
  if (!path4)
    return key;
  return path4.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (null_default || FormData)();
  options = utils_default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path4) {
    let arr = value;
    if (value && !path4 && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path4, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path4) {
    if (utils_default.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path4.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils_default.isString(key) ? key.trim() : key,
        path4,
        exposedHelpers
      );
      if (result === true) {
        build(el, path4 ? path4.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode2;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/platform/browser/classes/FormData.js
var FormData_default = typeof FormData !== "undefined" ? FormData : null;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/platform/browser/classes/Blob.js
var Blob_default = typeof Blob !== "undefined" ? Blob : null;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/platform/browser/index.js
var browser_default = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: Blob_default
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/platform/common/utils.js
var utils_exports = {};
__export(utils_exports, {
  hasBrowserEnv: () => hasBrowserEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  navigator: () => _navigator,
  origin: () => origin
});
var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
var _navigator = typeof navigator === "object" && navigator || void 0;
var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
var hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
var origin = hasBrowserEnv && window.location.href || "http://localhost";

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/platform/index.js
var platform_default = {
  ...utils_exports,
  ...browser_default
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new platform_default.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path4, helpers) {
      if (platform_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path4, value, target, index) {
    let name = path4[index++];
    if (name === "__proto__")
      return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path4.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path4, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils_default.isObject(data);
    if (isObjectPayload && utils_default.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils_default.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
    }
    if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
      return data;
    }
    if (utils_default.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils_default.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData_default(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
      return data;
    }
    if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform_default.classes.FormData,
    Blob: platform_default.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
var defaults_default = defaults;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value))
    return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var AxiosHeaders = class {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else if (utils_default.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils_default.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/cancel/CanceledError.js
function CanceledError(message, config, request) {
  AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true
});
var CanceledError_default = CanceledError;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default(
      "Request failed with status code " + response.status,
      [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
var speedometer_default = speedometer;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
var throttle_default = throttle;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return throttle_default((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
var progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
var asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv() {
    const msie = platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url) {
      let href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin(requestURL) {
      const parsed = utils_default.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  }()
);

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path4, domain, secure) {
      const cookie = [name + "=" + encodeURIComponent(value)];
      utils_default.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
      utils_default.isString(path4) && cookie.push("path=" + path4);
      utils_default.isString(domain) && cookie.push("domain=" + domain);
      secure === true && cookie.push("secure");
      document.cookie = cookie.join("; ");
    },
    read(name) {
      const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils_default.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/resolveConfig.js
var resolveConfig_default = (config) => {
  const newConfig = mergeConfig({}, config);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders_default.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  let contentType;
  if (utils_default.isFormData(data)) {
    if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if ((contentType = headers.getContentType()) !== false) {
      const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
    }
  }
  if (platform_default.hasStandardBrowserEnv) {
    withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig_default(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders_default.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitional_default;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError_default(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils_default.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError_default(`timeout ${timeout} of ms exceeded`, AxiosError_default.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils_default.asap(unsubscribe);
    return signal;
  }
};
var composeSignals_default = composeSignals;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
var readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
var readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
var trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  });
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/adapters/fetch.js
var isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
var isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
var encodeText = isFetchSupported && (typeof TextEncoder === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
var test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};
var supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;
  const hasContentType = new Request(platform_default.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      duplexAccessed = true;
      return "half";
    }
  }).headers.has("Content-Type");
  return duplexAccessed && !hasContentType;
});
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var supportsResponseStream = isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
var resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};
isFetchSupported && ((res) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
    !resolvers[type] && (resolvers[type] = utils_default.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
      throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
    });
  });
})(new Response());
var getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }
  if (utils_default.isBlob(body)) {
    return body.size;
  }
  if (utils_default.isSpecCompliantForm(body)) {
    const _request = new Request(platform_default.origin, {
      method: "POST",
      body
    });
    return (await _request.arrayBuffer()).byteLength;
  }
  if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
    return body.byteLength;
  }
  if (utils_default.isURLSearchParams(body)) {
    body = body + "";
  }
  if (utils_default.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};
var resolveBodyLength = async (headers, body) => {
  const length = utils_default.toFiniteNumber(headers.getContentLength());
  return length == null ? getBodyLength(body) : length;
};
var fetch_default = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = "same-origin",
    fetchOptions
  } = resolveConfig_default(config);
  responseType = responseType ? (responseType + "").toLowerCase() : "text";
  let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
  let request;
  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
    composedSignal.unsubscribe();
  });
  let requestContentLength;
  try {
    if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
      let _request = new Request(url, {
        method: "POST",
        body: data,
        duplex: "half"
      });
      let contentTypeHeader;
      if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
        headers.setContentType(contentTypeHeader);
      }
      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );
        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }
    if (!utils_default.isString(withCredentials)) {
      withCredentials = withCredentials ? "include" : "omit";
    }
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : void 0
    });
    let response = await fetch(request);
    const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
    if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
      const options = {};
      ["status", "statusText", "headers"].forEach((prop) => {
        options[prop] = response[prop];
      });
      const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];
      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }
    responseType = responseType || "text";
    let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
    !isStreamResponse && unsubscribe && unsubscribe();
    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders_default.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    });
  } catch (err) {
    unsubscribe && unsubscribe();
    if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      );
    }
    throw AxiosError_default.from(err, err && err.code, config, request);
  }
});

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/adapters/adapters.js
var knownAdapters = {
  http: null_default,
  xhr: xhr_default,
  fetch: fetch_default
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
var adapters_default = {
  getAdapter: (adapters) => {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters_default.getAdapter(config.adapter || defaults_default.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders_default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/env/data.js
var VERSION = "1.7.7";

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/validator.js
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
        AxiosError_default.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version + " and will be removed in the near future"
        )
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validator_default = {
  assertOptions,
  validators
};

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/core/Axios.js
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;
        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : dummy = new Error();
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, true);
      }
    }
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils_default.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils_default.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_default = Axios;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/cancel/CancelToken.js
var CancelToken = class {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
var CancelToken_default = CancelToken;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;

// node_modules/.store/axios@1.7.7/node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;

// node_modules/.store/axios@1.7.7/node_modules/axios/index.js
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  getAdapter,
  mergeConfig: mergeConfig2
} = axios_default;

// src/api.ts
var API = class {
  constructor(i18n) {
    this.i18n = i18n;
    this.settings = this.i18n.settings;
  }
  async directory() {
    let res = [];
    const RequestUrlParam2 = {
      url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], "directory.json"),
      method: "GET"
    };
    try {
      const response = await (0, import_obsidian8.requestUrl)(RequestUrlParam2);
      res = response.json;
    } catch (error) {
      NoticeError("\u7F51\u7EDC", error);
    }
    return res;
  }
  async directoryTest() {
    let res = true;
    const RequestUrlParam2 = {
      url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], "directory.json"),
      method: "GET"
    };
    try {
      await (0, import_obsidian8.requestUrl)(RequestUrlParam2);
    } catch (error) {
      res = false;
      console.log(error);
    }
    return res;
  }
  async ignore() {
    let resData = [];
    const RequestUrlParam2 = {
      url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], "ignore.json"),
      method: "GET"
    };
    try {
      const response = await (0, import_obsidian8.requestUrl)(RequestUrlParam2);
      resData = response.json;
    } catch (error) {
      NoticeError("\u7F51\u7EDC", error);
    }
    return resData;
  }
  async ignoreTest() {
    let res = true;
    const RequestUrlParam2 = {
      url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], "ignore.json"),
      method: "GET"
    };
    try {
      await (0, import_obsidian8.requestUrl)(RequestUrlParam2);
    } catch (error) {
      res = false;
    }
    return res;
  }
  async translation(id, version) {
    let res;
    const RequestUrlParam2 = {
      url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], `plugins\\${id}\\${version}.json`),
      method: "GET"
    };
    try {
      const response = await (0, import_obsidian8.requestUrl)(RequestUrlParam2);
      res = response.json;
    } catch (error) {
      console.log(error);
    }
    return res;
  }
  baidu(q) {
    const BAIDU = this.i18n.settings.I18N_NIT_APIS.BAIDU;
    const md5 = (0, import_crypto.createHash)("md5");
    const from = BAIDU.FROM;
    const to = BAIDU.TO;
    const appid = BAIDU.APP_ID;
    const key = BAIDU.KEY;
    const salt = Math.round(Math.random() * 10);
    const sign = md5.update(`${appid}${q}${salt}${key}`).digest("hex");
    const RequestUrlParam2 = {
      url: `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
      method: "GET"
    };
    return (0, import_obsidian8.requestUrl)(RequestUrlParam2);
  }
  baiduTest() {
    const BAIDU = this.i18n.settings.I18N_NIT_APIS.BAIDU;
    const md5 = (0, import_crypto.createHash)("md5");
    const from = BAIDU.FROM;
    const to = BAIDU.TO;
    const appid = BAIDU.APP_ID;
    const key = BAIDU.KEY;
    const salt = Math.round(Math.random() * 10);
    const sign = md5.update(`${appid}${"i18n"}${salt}${key}`).digest("hex");
    const RequestUrlParam2 = {
      url: `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${"i18n"}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
      method: "GET"
    };
    const response = (0, import_obsidian8.requestUrl)(RequestUrlParam2);
    response.then((res) => {
      if (res.json.hasOwnProperty("error_code")) {
        const error_code = res.json.error_code;
        NoticeError("\u767E\u5EA6", `${error_code}
${BAIDU_ERROR_CODE[error_code]}`);
      } else {
        NoticeOperationResult("\u767E\u5EA6", true);
      }
    }).catch((error) => {
      NoticeOperationResult("\u767E\u5EA6", false, error);
    });
  }
  async openAI(plugin, q) {
    try {
      const response = await axios_default.post(`${this.settings.I18N_NIT_OPENAI_URL}/v1/chat/completions`, {
        model: this.settings.I18N_NIT_OPENAI_MODEL,
        messages: [
          { role: "user", content: this.settings.I18N_NIT_OPENAI_TIPS },
          { role: "user", content: q }
        ],
        temperature: 0.7
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.settings.I18N_NIT_OPENAI_KEY}`
        }
      });
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message;
      }
      return null;
    } catch (error) {
      PNotice("\u9519\u8BEF", error);
      return null;
    }
  }
  openAITest() {
    const RequestUrlParam2 = {
      url: `${this.settings.I18N_NIT_OPENAI_URL}/v1/chat/completions`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.settings.I18N_NIT_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: this.settings.I18N_NIT_OPENAI_MODEL,
        messages: [
          { role: "user", content: "i18n" }
        ],
        temperature: 0.7
      })
    };
    const response = (0, import_obsidian8.requestUrl)(RequestUrlParam2);
    response.then(() => {
      NoticeOperationResult("OpenAI", true);
    }).catch((error) => {
      NoticeOperationResult("OpenAI", false, error);
    });
  }
  async giteeIssue(title, body) {
    try {
      const response = await axios_default.post(`https://gitee.com/api/v5/repos/zero--two/issues`, {
        access_token: "daf37a8fd060fed874af3314ee52959b",
        repo: "obsidian-i18n-translation",
        title,
        body
      }, {
        headers: {
          "Content-Type": "application/json",
          "Charset": "UTF-8"
        }
      });
      NoticeOperationResult("\u8BD1\u6587\u63D0\u4EA4", true);
      if (response.data.number)
        return response.data.number;
      return null;
    } catch (error) {
      NoticeOperationResult("\u8BD1\u6587\u63D0\u4EA4", false, `${error}`);
      return null;
    }
  }
  async giteegetIssue() {
    let res = [];
    const owner = "zero--two";
    const repo = "obsidian-i18n-translation";
    const RequestUrlParam2 = {
      url: `https://gitee.com/api/v5/repos/${owner}/${repo}/issues`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Charset": "UTF-8"
      }
    };
    try {
      const response = await (0, import_obsidian8.requestUrl)(RequestUrlParam2);
      res = response.json;
    } catch (error) {
      NoticeError("\u7F51\u7EDC", error);
    }
    return res;
  }
};

// src/settings/ui/i18n-mod-nit.ts
var I18nModeNIT = class extends BaseSetting {
  main() {
    const api = new API(this.i18n);
    const i18nModeNIT = new import_obsidian9.Setting(this.containerEl);
    i18nModeNIT.setClass("bold");
    i18nModeNIT.setName("\u673A\u5668\u7FFB\u8BD1\u6A21\u5F0F");
    i18nModeNIT.addToggle(
      (cb) => cb.setValue(this.settings.I18N_MODE_NIT).onChange(() => {
        this.settings.I18N_MODE_NIT = !this.settings.I18N_MODE_NIT;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
    const i18nNITAPI = new import_obsidian9.Setting(this.containerEl);
    if (!this.settings.I18N_MODE_NIT)
      i18nNITAPI.setClass("i18n_display-none");
    i18nNITAPI.setName("\u63A5\u53E3");
    i18nNITAPI.setDesc(t("SETTING_NIT_APIS_DESC"));
    i18nNITAPI.addDropdown(
      (cb) => cb.addOptions(API_TYPES).setValue(this.settings.I18N_NIT_API).onChange((value) => {
        this.settings.I18N_NIT_API = value;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
    i18nNITAPI.addButton(
      (cb) => cb.setButtonText("\u6D4B\u8BD5").onClick(() => {
        switch (this.settings.I18N_NIT_API) {
          case "BAIDU":
            api.baiduTest();
            break;
          case "OPENAI":
            api.openAITest();
            break;
          default:
            break;
        }
      })
    );
    const i18nModeNITInterval = new import_obsidian9.Setting(this.containerEl);
    i18nModeNITInterval.setName("\u95F4\u9694");
    i18nModeNITInterval.setDesc("\u7528\u4E8E\u9650\u5236\u6BCF\u6B21\u8BF7\u6C42\u95F4\u9694(\u5355\u4F4D: \u6BEB\u79D2)");
    if (!this.settings.I18N_MODE_NIT)
      i18nModeNITInterval.setClass("i18n_display-none");
    i18nModeNITInterval.addSlider(
      (cb) => cb.setDynamicTooltip().setLimits(0, 1e3, 50).setValue(this.settings.I18N_NIT_API_INTERVAL).onChange((value) => {
        this.settings.I18N_NIT_API_INTERVAL = value;
        this.i18n.saveSettings();
      })
    );
  }
};

// src/settings/ui/i18n-nit-baidu.ts
var import_obsidian10 = require("obsidian");
var from_lang = {
  "auto": "\u81EA\u52A8\u68C0\u6D4B",
  "zh": "\u4E2D\u6587",
  "cht": "\u7E41\u4F53\u4E2D\u6587",
  "yue": "\u7CA4\u8BED",
  "wyw": "\u6587\u8A00\u6587",
  "en": "\u82F1\u8BED",
  "jp": "\u65E5\u8BED",
  "kor": "\u97E9\u8BED",
  "fra": "\u6CD5\u8BED",
  "spa": "\u897F\u73ED\u7259\u8BED",
  "th": "\u6CF0\u8BED",
  "ara": "\u963F\u62C9\u4F2F\u8BED",
  "ru": "\u4FC4\u8BED",
  "pt": "\u8461\u8404\u7259\u8BED",
  "de": "\u5FB7\u8BED",
  "it": "\u610F\u5927\u5229\u8BED",
  "el": "\u5E0C\u814A\u8BED",
  "nl": "\u8377\u5170\u8BED",
  "pl": "\u6CE2\u5170\u8BED",
  "bul": "\u4FDD\u52A0\u5229\u4E9A\u8BED",
  "est": "\u7231\u6C99\u5C3C\u4E9A\u8BED",
  "dan": "\u4E39\u9EA6\u8BED",
  "fin": "\u82AC\u5170\u8BED",
  "cs": "\u6377\u514B\u8BED",
  "rom": "\u7F57\u9A6C\u5C3C\u4E9A\u8BED",
  "slo": "\u65AF\u6D1B\u6587\u5C3C\u4E9A\u8BED",
  "swe": "\u745E\u5178\u8BED",
  "hu": "\u5308\u7259\u5229\u8BED",
  "vie": "\u8D8A\u5357\u8BED"
};
var to_lang = JSON.parse(JSON.stringify(from_lang));
delete to_lang.auto;
var I18nNitBaiDu = class extends BaseSetting {
  main() {
    const i18nNitBaiDu = new import_obsidian10.Setting(this.containerEl);
    i18nNitBaiDu.setName(t("SETTING_NIT_BAIDU"));
    i18nNitBaiDu.setDesc(t("SETTING_NIT_BAIDU_DESC"));
    if (!this.settings.I18N_MODE_NIT)
      i18nNitBaiDu.setClass("i18n_display-none");
    if (!(this.settings.I18N_NIT_API == "BAIDU"))
      i18nNitBaiDu.setClass("i18n_display-none");
    i18nNitBaiDu.addDropdown(
      (cb) => cb.addOptions(from_lang).setValue(this.settings.I18N_NIT_APIS.BAIDU.FROM).onChange((value) => {
        this.settings.I18N_NIT_APIS.BAIDU.FROM = value;
        this.i18n.saveSettings();
      })
    );
    i18nNitBaiDu.addDropdown(
      (cb) => cb.addOptions(to_lang).setValue(this.settings.I18N_NIT_APIS.BAIDU.TO).onChange((value) => {
        this.settings.I18N_NIT_APIS.BAIDU.TO = value;
        this.i18n.saveSettings();
      })
    );
    i18nNitBaiDu.addText(
      (cb) => cb.setValue(this.settings.I18N_NIT_APIS.BAIDU.APP_ID).setPlaceholder("APPID").onChange((value) => {
        this.settings.I18N_NIT_APIS.BAIDU.APP_ID = value;
        this.i18n.saveSettings();
      })
    );
    i18nNitBaiDu.addText(
      (cb) => cb.setValue(this.settings.I18N_NIT_APIS.BAIDU.KEY).setPlaceholder("KEY").onChange((value) => {
        this.settings.I18N_NIT_APIS.BAIDU.KEY = value;
        this.i18n.saveSettings();
      })
    );
  }
};

// src/settings/ui/i18n-author.ts
var import_obsidian11 = require("obsidian");
var I18nAuthor = class extends BaseSetting {
  main() {
    const i18nAuthor = new import_obsidian11.Setting(this.containerEl);
    i18nAuthor.setName("\u8BD1\u6587\u7B7E\u540D");
    i18nAuthor.setDesc("\u751F\u6210\u8BD1\u6587\u65F6\u81EA\u52A8\u6DFB\u52A0\u4F5C\u8005\u7B7E\u540D");
    i18nAuthor.addText(
      (cb) => cb.setValue(this.settings.I18N_AUTHOR).setPlaceholder("\u7B7E\u540D").onChange((value) => {
        this.settings.I18N_AUTHOR = value;
        this.i18n.saveSettings();
      })
    );
  }
};

// src/settings/ui/i18n-open-settings.ts
var import_obsidian12 = require("obsidian");
var I18nOpenSettings = class extends BaseSetting {
  main() {
    const i18nOpenSettings = new import_obsidian12.Setting(this.containerEl);
    i18nOpenSettings.setName("\u6253\u5F00\u8BBE\u7F6E");
    i18nOpenSettings.setDesc("\u542F\u7528\u540E\u63D2\u4EF6\u9875\u9762\u4E2D\u4F1A\u663E\u793A\u8BBE\u7F6E\u8DF3\u8F6C\u6309\u94AE");
    i18nOpenSettings.addToggle(
      (cb) => cb.setValue(this.settings.I18N_OPEN_SETTINGS).onChange(() => {
        this.settings.I18N_OPEN_SETTINGS = !this.settings.I18N_OPEN_SETTINGS;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
  }
};

// src/settings/ui/i18n-nit-openAI.ts
var import_obsidian13 = require("obsidian");
var I18nNITOpenAI = class extends BaseSetting {
  main() {
    const i18nNITOpenAI = new import_obsidian13.Setting(this.containerEl);
    i18nNITOpenAI.setName("\u5730\u5740");
    i18nNITOpenAI.setDesc("\u4F7F\u7528openai\u8FDB\u884C\u7FFB\u8BD1");
    if (!this.settings.I18N_MODE_NIT)
      i18nNITOpenAI.setClass("i18n_display-none");
    if (!(this.settings.I18N_NIT_API == "OPENAI"))
      i18nNITOpenAI.setClass("i18n_display-none");
    i18nNITOpenAI.addText(
      (cb) => cb.setValue(this.settings.I18N_NIT_OPENAI_URL).setPlaceholder("https://api.openai.com").onChange((value) => {
        this.settings.I18N_NIT_OPENAI_URL = value;
        this.i18n.saveSettings();
      })
    );
    i18nNITOpenAI.addText(
      (cb) => cb.setValue(this.settings.I18N_NIT_OPENAI_KEY).setPlaceholder("KEY").onChange((value) => {
        this.settings.I18N_NIT_OPENAI_KEY = value;
        this.i18n.saveSettings();
      })
    );
    i18nNITOpenAI.addText(
      (cb) => cb.setValue(this.settings.I18N_NIT_OPENAI_MODEL).setPlaceholder("\u6A21\u578B").onChange((value) => {
        this.settings.I18N_NIT_OPENAI_MODEL = value;
        this.i18n.saveSettings();
      })
    );
    const i18nAIOpenAITips = new import_obsidian13.Setting(this.containerEl);
    if (!this.settings.I18N_MODE_NIT)
      i18nAIOpenAITips.setClass("i18n_display-none");
    if (!(this.settings.I18N_NIT_API == "OPENAI"))
      i18nAIOpenAITips.setClass("i18n_display-none");
    i18nAIOpenAITips.setName("\u63D0\u793A");
    i18nAIOpenAITips.setDesc("\u5373prompt\uFF0C\u7528\u4E8E\u6307\u5BFCAI\u5982\u4F55\u7FFB\u8BD1\uFF0C\u672C\u63D2\u4EF6\u63D0\u4F9B\u9ED8\u8BA4\u63D0\u793A\u8BCD\uFF0C\u5982\u6709\u9700\u8981\u53EF\u81EA\u884C\u8C03\u6574\u3002");
    i18nAIOpenAITips.addTextArea(
      (cb) => cb.setValue(this.settings.I18N_NIT_OPENAI_TIPS).setPlaceholder("\u63D0\u793A\u8BCD").onChange((value) => {
        this.settings.I18N_NIT_OPENAI_TIPS = value;
        this.i18n.saveSettings();
      })
    );
  }
};

// src/settings/ui/i18n-edit-mode.ts
var import_obsidian14 = require("obsidian");
var I18nEditMode = class extends BaseSetting {
  main() {
    const i18nEditMode = new import_obsidian14.Setting(this.containerEl);
    i18nEditMode.setName("\u8BD1\u6587\u7F16\u8F91");
    i18nEditMode.setDesc("\u542F\u7528/\u7981\u7528\u5185\u7F6E\u8BD1\u6587\u7F16\u8F91\u5668\u529F\u80FD");
    i18nEditMode.addToggle(
      (cb) => cb.setValue(this.settings.I18N_EDIT_MODE).onChange(() => {
        this.settings.I18N_EDIT_MODE = !this.settings.I18N_EDIT_MODE;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
  }
};

// src/settings/ui/i18n-submite-translation.ts
var import_obsidian15 = require("obsidian");
var I18nSubmiteTranslationMode = class extends BaseSetting {
  main() {
    const i18nSubmiteTranslationMode = new import_obsidian15.Setting(this.containerEl);
    i18nSubmiteTranslationMode.setName("\u8BD1\u6587\u63D0\u4EA4");
    i18nSubmiteTranslationMode.setDesc("\u4E00\u952E\u53D1\u9001\u8BD1\u6587\u81F3\u4F5C\u8005(\u8BF7\u52FF\u6EE5\u7528)");
    i18nSubmiteTranslationMode.addToggle(
      (cb) => cb.setValue(this.settings.I18N_SUBMIT_TRANSLATION_MODE).onChange(() => {
        this.settings.I18N_SUBMIT_TRANSLATION_MODE = !this.settings.I18N_SUBMIT_TRANSLATION_MODE;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
  }
};

// src/settings/ui/i18n-ignore.ts
var import_obsidian16 = require("obsidian");
var I18nIgnore = class extends BaseSetting {
  main() {
    const i18nIgnore = new import_obsidian16.Setting(this.containerEl);
    i18nIgnore.setName("\u5FFD\u7565\u63D2\u4EF6");
    i18nIgnore.setDesc("\u5FFD\u7565\u53EF\u80FD\u81EA\u5E26\u6C49\u5316\u7684\u63D2\u4EF6(\u9700\u8981\u4E91\u7AEF\u7FFB\u8BD1API\u652F\u6301)");
    i18nIgnore.addToggle(
      (cb) => cb.setValue(this.settings.I18N_IGNORE).onChange(async () => {
        this.settings.I18N_IGNORE = !this.settings.I18N_IGNORE;
        this.i18n.saveSettings();
        const id = this.i18n.manifest.id;
        const settings = this.app.setting;
        await this.app.plugins.disablePlugin(id);
        await this.app.plugins.enablePlugin(id);
        settings.close();
      })
    );
  }
};

// src/settings/ui/i18n-re.ts
var import_obsidian17 = require("obsidian");
var I18nRE = class extends BaseSetting {
  main() {
    const i18nREMode = new import_obsidian17.Setting(this.containerEl);
    i18nREMode.setName("\u6A21\u5F0F");
    i18nREMode.setDesc("\u5F53\u524D\u6B63\u5728\u4F7F\u7528\u7684\u5339\u914D\u6A21\u5F0F");
    i18nREMode.addText(
      (cb) => cb.setValue(this.settings.I18N_RE_MODE).setDisabled(true)
    );
    i18nREMode.addButton(
      (cb) => cb.setButtonText(this.settings.I18N_RE_MODE_EDIT ? "\u9690\u85CF" : "\u7F16\u8F91").onClick(() => {
        this.settings.I18N_RE_MODE_EDIT = !this.settings.I18N_RE_MODE_EDIT;
        this.i18n.saveSettings();
        this.settingTab.display();
      })
    );
    if (this.settings.I18N_RE_MODE_EDIT) {
      const i18nREFlags = new import_obsidian17.Setting(this.containerEl);
      i18nREFlags.setName("\u6807\u5FD7");
      i18nREFlags.setDesc("\u6B63\u5219\u8868\u8FBE\u5F0F\u7684flags");
      i18nREFlags.addText(
        (cb) => cb.setValue(this.settings.I18N_RE_FLAGS).setPlaceholder("flags").onChange((value) => {
          this.settings.I18N_RE_FLAGS = value;
          this.i18n.saveSettings();
        })
      );
      const i18nRELength = new import_obsidian17.Setting(this.containerEl);
      i18nRELength.setName("\u957F\u5EA6");
      i18nRELength.setDesc("re\u53EF\u4EE5\u5339\u914D\u5230\u7684\u6700\u5927\u957F\u5EA6");
      i18nRELength.addSlider(
        (cb) => cb.setDynamicTooltip().setLimits(0, 1e3, 25).setValue(this.settings.I18N_RE_LENGTH).onChange((value) => {
          this.settings.I18N_RE_LENGTH = value;
          this.i18n.saveSettings();
        })
      );
      let modeString = "";
      const i18nREModes = new import_obsidian17.Setting(this.containerEl);
      i18nREModes.setName("\u6A21\u5F0F\u7F16\u8F91");
      i18nREModes.setDesc("\u65B0\u589E\u548C\u5220\u9664\u6B63\u5219\u8868\u8FBE\u5F0F\u5339\u914D\u6A21\u5F0F");
      i18nREModes.addText(
        (cb) => cb.setPlaceholder("\u6A21\u5F0F").onChange((value) => {
          modeString = value;
        })
      );
      i18nREModes.addButton(
        (cb) => cb.setButtonText("\u6DFB\u52A0").onClick(() => {
          if (modeString != "" && !this.settings.I18N_RE_MODES.includes(modeString)) {
            this.settings.I18N_RE_MODES.push(modeString);
            if (!this.settings.I18N_RE_DATAS.hasOwnProperty(modeString)) {
              this.settings.I18N_RE_DATAS[modeString] = [];
            }
            this.i18n.saveSettings();
            this.settingTab.display();
          } else {
            new import_obsidian17.Notice(`RE\u6A21\u5F0F\u540D\u79F0\u91CD\u590D \u65E0\u6CD5\u6DFB\u52A0`);
          }
        })
      );
      i18nREModes.addButton(
        (cb) => cb.setButtonText(this.settings.I18N_RE_MODE_DISPLAY ? "\u9690\u85CF" : "\u67E5\u770B").onClick(() => {
          this.settings.I18N_RE_MODE_DISPLAY = !this.settings.I18N_RE_MODE_DISPLAY;
          this.i18n.saveSettings();
          this.settingTab.display();
        })
      );
      if (this.settings.I18N_RE_MODE_DISPLAY) {
        for (let i = 0; i < this.settings.I18N_RE_MODES.length; i++) {
          const i18nREModeItem = new import_obsidian17.Setting(this.containerEl);
          i18nREModeItem.setName(this.settings.I18N_RE_MODES[i]);
          if (this.settings.I18N_RE_MODE != this.settings.I18N_RE_MODES[i]) {
            i18nREModeItem.addButton(
              (cb) => cb.setIcon("check").onClick(() => {
                this.settings.I18N_RE_MODE = this.settings.I18N_RE_MODES[i];
                this.i18n.saveSettings();
                this.settingTab.display();
              })
            );
          }
          i18nREModeItem.addButton(
            (cb) => cb.setIcon("trash").onClick(() => {
              if (this.settings.I18N_RE_MODES.length > 1) {
                delete this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODES[i]];
                const a = this.settings.I18N_RE_MODES[i];
                const b = this.settings.I18N_RE_MODE;
                console.log(a == b);
                if (this.settings.I18N_RE_MODES[i] == this.settings.I18N_RE_MODE) {
                  this.settings.I18N_RE_MODE = this.settings.I18N_RE_MODES[0];
                }
                this.settings.I18N_RE_MODES.splice(i, 1);
                new import_obsidian17.Notice(`\u5220\u9664\u6210\u529F`);
              } else {
                new import_obsidian17.Notice(`\u53EA\u5269\u4E0B\u4E00\u4E2A\u4E86 \u65E0\u6CD5\u5220\u9664`);
              }
              this.i18n.saveSettings();
              this.settingTab.display();
            })
          );
        }
      }
      let regexpString = "";
      const i18nREDatas = new import_obsidian17.Setting(this.containerEl);
      i18nREDatas.setName("\u6570\u636E\u7F16\u8F91");
      i18nREDatas.setDesc("\u65B0\u589E\u548C\u5220\u9664\u6B63\u5219\u8868\u8FBE\u5F0F\u6A21\u5F0F\u6570\u636E");
      i18nREDatas.addText(
        (cb) => cb.setPlaceholder("RegExp").onChange((value) => {
          regexpString = value;
        })
      );
      i18nREDatas.addButton(
        (cb) => cb.setButtonText("\u6DFB\u52A0").onClick(() => {
          if (regexpString != "") {
            this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].push(regexpString);
            this.i18n.saveSettings();
            this.settingTab.display();
          }
        })
      );
      i18nREDatas.addButton(
        (cb) => cb.setButtonText(this.settings.I18N_RE_DATAS_DISPLAY ? "\u9690\u85CF" : "\u67E5\u770B").onClick(() => {
          this.settings.I18N_RE_DATAS_DISPLAY = !this.settings.I18N_RE_DATAS_DISPLAY;
          this.i18n.saveSettings();
          this.settingTab.display();
        })
      );
      if (this.settings.I18N_RE_DATAS_DISPLAY) {
        for (let i = 0; i < this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].length; i++) {
          const i18nREDatasItem = new import_obsidian17.Setting(this.containerEl);
          i18nREDatasItem.setName(this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE][i]);
          i18nREDatasItem.addButton(
            (cb) => cb.setIcon("trash").onClick(() => {
              this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].splice(i, 1);
              this.i18n.saveSettings();
              this.settingTab.display();
            })
          );
        }
      }
    }
  }
};

// src/settings/ui/index.ts
var I18nSettingTab = class extends import_obsidian18.PluginSettingTab {
  constructor(app, i18n) {
    super(app, i18n);
    this.i18n = i18n;
    this.app = app;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian18.Setting(containerEl).setName("\u57FA\u7840\u8BBE\u7F6E").setHeading();
    new I18nHelp(this).display();
    new I18nLanguage(this).display();
    new I18nModLDT(this).display();
    new I18nModNDT(this).display();
    new I18nNdtApi(this).display();
    new I18nModeNIT(this).display();
    new I18nNitBaiDu(this).display();
    new I18nNITOpenAI(this).display();
    new import_obsidian18.Setting(containerEl).setName("\u66F4\u591A\u529F\u80FD").setHeading();
    new I18nAuthor(this).display();
    new I18nOpenSettings(this).display();
    new I18nEditMode(this).display();
    new I18nSubmiteTranslationMode(this).display();
    new I18nIgnore(this).display();
    new import_obsidian18.Setting(containerEl).setName("\u5339\u914D\u6A21\u5F0F\u914D\u7F6E").setHeading();
    new I18nRE(this).display();
  }
};

// src/modal/i18n-modal.ts
var path2 = __toESM(require("path"));
var fs2 = __toESM(require_lib());
var import_child_process = require("child_process");
var import_obsidian21 = require("obsidian");

// src/modal/git-issue-modal.ts
var import_obsidian19 = require("obsidian");
var GitIssueModal = class extends import_obsidian19.Modal {
  constructor(app, title, body, onSubmit) {
    super(app);
    this.title = title;
    this.body = body;
    this.onSubmit = onSubmit;
  }
  async Main() {
    const { contentEl } = this;
    contentEl.createEl("h4", { text: "\u63D0\u4EA4\u7FFB\u8BD1\u6587\u4EF6" });
    contentEl.createEl("div", { text: "\u8BF7\u518D\u6B21\u786E\u8BA4\u60A8\u7684\u63D0\u4EA4" });
    contentEl.createEl("div", { text: "\u786E\u4FDD\u6BCF\u4E00\u4EFD\u52AA\u529B\u90FD\u80FD\u6709\u6548\u8D21\u732E" });
    contentEl.createEl("div", { text: "\u907F\u514D\u65E0\u6548\u5185\u5BB9\u5360\u7528\u5B9D\u8D35\u8D44\u6E90\u54E6" });
    const buttonBlock = new import_obsidian19.Setting(contentEl);
    const cancelButton = new import_obsidian19.ButtonComponent(buttonBlock.controlEl);
    cancelButton.setButtonText("\u53D6\u6D88");
    cancelButton.onClick(() => {
      this.close();
    });
    const submitButton = new import_obsidian19.ButtonComponent(buttonBlock.controlEl);
    submitButton.setButtonText("\u63D0\u4EA4");
    submitButton.setCta();
    submitButton.onClick(() => {
      this.onSubmit();
    });
  }
  reload() {
    this.close();
    this.open();
  }
  async onOpen() {
    await this.Main();
  }
  async onClose() {
    this.contentEl.empty();
  }
};

// src/modal/wizard-modal.ts
var import_obsidian20 = require("obsidian");
var WizardModal = class extends import_obsidian20.Modal {
  constructor(app, i18n) {
    super(app);
    this.i18n = i18n;
  }
  async Main() {
    const { contentEl } = this;
    this.contentEl.addClass("i18n_wizard_modal");
    this.img = this.contentEl.doc.createElement("img");
    this.img.addClass("i18n_wizard_modal_img");
    this.img.src = Url.I18N_ICON;
    this.contentEl.appendChild(this.img);
    this.title = this.contentEl.doc.createElement("p");
    this.title.addClass("i18n_wizard_modal_title");
    this.title.innerHTML = "Obsidian-I18N";
    this.contentEl.appendChild(this.title);
    this.version = this.contentEl.doc.createElement("p");
    this.version.addClass("i18n_wizard_modal_version");
    this.version.innerHTML = `\u7248\u672C ${this.i18n.manifest.version}`;
    this.contentEl.appendChild(this.version);
    const videoTutorial = new import_obsidian20.Setting(contentEl);
    videoTutorial.setName("\u5B98\u65B9\u89C6\u9891\u6559\u7A0B");
    videoTutorial.setDesc("\u8BE6\u5C3D\u6F14\u793AObsidian i18n\u64CD\u4F5C\uFF0C\u52A9\u529B\u5FEB\u901F\u638C\u63E1");
    const videoTutorialButton = new import_obsidian20.ButtonComponent(videoTutorial.controlEl);
    videoTutorialButton.setButtonText("\u6D4F\u89C8");
    videoTutorialButton.setCta();
    videoTutorialButton.setTooltip("");
    videoTutorialButton.onClick(() => {
      window.open(Url.VIDEO_TUTORIAL);
    });
    const documentationTutorial = new import_obsidian20.Setting(contentEl);
    documentationTutorial.setName("\u5B98\u65B9\u6587\u6863\u6559\u7A0B");
    documentationTutorial.setDesc("Obsidian i18n\u7684\u5168\u9762\u63A2\u7D22\u4E4B\u65C5\u6307\u5357");
    const documentationTutorialButton = new import_obsidian20.ButtonComponent(documentationTutorial.controlEl);
    documentationTutorialButton.setButtonText("\u6D4F\u89C8");
    documentationTutorialButton.setTooltip("");
    documentationTutorialButton.onClick(() => {
      window.open(Url.DOCUMENTATION_TUTORIAL);
    });
    const community = new import_obsidian20.Setting(contentEl);
    community.setName("\u5B98\u65B9Q\u7FA4");
    community.setDesc("\u5728\u5B98\u65B9\u7FA4\uFF0C\u60A8\u53EF\u53D1\u5E03\u9700\u6C42\u3001\u63D0\u4EA4BUG\u3001\u5206\u4EAB\u8BD1\u6587\uFF0C\u5E76\u4E0E\u5176\u4ED6\u7528\u6237\u5C31\u63D2\u4EF6\u4F7F\u7528\u3001\u7FFB\u8BD1\u7B49\u8BDD\u9898\u4EA4\u6D41\u4E92\u52A9\u3002");
    const communityButton = new import_obsidian20.ButtonComponent(community.controlEl);
    communityButton.setButtonText("\u52A0\u5165");
    communityButton.setTooltip("");
    communityButton.onClick(() => {
      window.open(Url.QQ_GROUP);
    });
  }
  async onOpen() {
    await this.Main();
  }
  async onClose() {
    this.contentEl.empty();
  }
};

// src/modal/i18n-modal.ts
var I18NModal = class extends import_obsidian21.Modal {
  // ============================================================
  //                       构造函数
  // ============================================================
  constructor(app, i18n) {
    super(app);
    // [本地][变量] 全部插件列表
    this.plugins = [];
    // [本地][变量] 展示插件列表
    this.showPlugins = [];
    this.developerMode = false;
    this.i18n = i18n;
    this.basePath = path2.normalize(this.app.vault.adapter.getBasePath());
    this.settings = i18n.settings;
    this.settingPlugins = this.app.setting;
    this.regexps = this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE];
  }
  // ============================================================
  //                        展示操作
  // ============================================================
  async showHead() {
    const modalEl = this.contentEl.parentElement;
    modalEl.addClass("i18n_modal");
    modalEl.removeChild(modalEl.getElementsByClassName("modal-close-button")[0]);
    this.titleEl.addClass("i18n_modal_title_box");
    this.contentEl.addClass("i18n_modal_item_box");
    const test2 = new import_obsidian21.Setting(this.titleEl);
    test2.setClass("i18n_modal_title_box_1");
    test2.setName("\u9047\u5230\u96BE\u9898\uFF1F\u901F\u52A0Q\u7FA4\u54A8\u8BE2\uFF01");
    const qqButton = new import_obsidian21.ButtonComponent(test2.controlEl);
    qqButton.setIcon("i18n_qq");
    qqButton.setTooltip("\u4E00\u952E\u76F4\u8FBE\uFF0C\u52A0\u5165Q\u7FA4\u5171\u4EAB\u7CBE\u5F69\uFF01");
    qqButton.onClick(() => {
      window.open(Url.QQ_GROUP);
    });
    const settingTabButton = new import_obsidian21.ButtonComponent(test2.controlEl);
    settingTabButton.setIcon("settings");
    settingTabButton.setTooltip("\u6253\u5F00\u63D2\u4EF6\u8BBE\u7F6E");
    settingTabButton.onClick(() => {
      this.settingPlugins.open();
      this.settingPlugins.openTabById(this.i18n.manifest.id);
      this.close();
    });
    const helpButton = new import_obsidian21.ButtonComponent(test2.controlEl);
    helpButton.setIcon("circle-help");
    helpButton.setTooltip("\u5E2E\u52A9");
    helpButton.onClick(() => {
      new WizardModal(this.app, this.i18n).open();
    });
    const search = new import_obsidian21.Setting(this.titleEl);
    search.setClass("i18n_modal_title_box_2");
    search.setName("\u641C\u7D22");
    search.addDropdown(
      (cb) => cb.addOptions(I18N_SORT).setValue(this.settings.I18N_SORT).onChange((value) => {
        this.settings.I18N_SORT = value;
        this.i18n.saveSettings();
        this.reloadShowData();
      })
    );
    search.addDropdown(
      (cb) => cb.addOptions(I18N_TYPE).setValue(this.settings.I18N_TYPE).onChange((value) => {
        this.settings.I18N_TYPE = value;
        this.i18n.saveSettings();
        this.reloadShowData();
      })
    );
    search.addSearch(
      (cb) => cb.setValue(this.settings.I18N_SEARCH_TEXT).onChange((value) => {
        this.settings.I18N_SEARCH_TEXT = value;
        this.i18n.saveSettings();
        this.reloadShowData();
      })
    );
    if (this.developerMode) {
      const reload = new import_obsidian21.ButtonComponent(test2.controlEl);
      reload.setIcon("refresh-ccw");
      reload.setTooltip("\u5237\u65B0\u63D2\u4EF6");
      reload.onClick(async () => {
        await this.reloadPlugin(this.i18n.manifest.id);
        this.close();
      });
    }
  }
  // ============================================================
  //                        展示数据
  // ============================================================
  async showData() {
    this.plugins = Object.values(this.app.plugins.manifests);
    this.plugins = this.plugins.filter((item) => item.id !== this.i18n.manifest.id);
    this.enabledPlugins = this.app.plugins.enabledPlugins;
    if (this.settings.I18N_SEARCH_TEXT == "") {
      this.showPlugins = this.plugins;
    } else {
      this.showPlugins = this.plugins.filter((item) => item.name.toLowerCase().indexOf(this.settings.I18N_SEARCH_TEXT.toLowerCase()) != -1);
    }
    const idsToRemove = [];
    switch (this.settings.I18N_TYPE) {
      case "0":
        break;
      case "1":
        for (const plugin of this.showPlugins) {
          const pluginDir = path2.join(this.basePath, plugin.dir);
          if (fs2.pathExistsSync(path2.join(pluginDir, "lang", `${this.settings.I18N_LANGUAGE}.json`))) {
            idsToRemove.push(plugin.id);
          }
        }
        this.showPlugins = this.showPlugins.filter((plugin) => !idsToRemove.includes(plugin.id));
        break;
      case "2":
        for (const plugin of this.showPlugins) {
          const pluginDir = path2.join(this.basePath, plugin.dir);
          const stateDoc = path2.join(pluginDir, "lang", "state.json");
          const isStateDoc = fs2.pathExistsSync(stateDoc);
          if (fs2.pathExistsSync(path2.join(pluginDir, "lang")) && isStateDoc) {
            if (fs2.readJsonSync(stateDoc).state != false) {
              idsToRemove.push(plugin.id);
            }
          } else {
            idsToRemove.push(plugin.id);
          }
        }
        this.showPlugins = this.showPlugins.filter((plugin) => !idsToRemove.includes(plugin.id));
        break;
      case "3":
        for (const plugin of this.showPlugins) {
          const pluginDir = path2.join(this.basePath, plugin.dir);
          const stateDoc = path2.join(pluginDir, "lang", "state.json");
          const isStateDoc = fs2.pathExistsSync(stateDoc);
          if (fs2.pathExistsSync(path2.join(pluginDir, "lang")) && isStateDoc) {
            if (fs2.readJsonSync(stateDoc).state != true) {
              idsToRemove.push(plugin.id);
            }
          } else {
            idsToRemove.push(plugin.id);
          }
        }
        this.showPlugins = this.showPlugins.filter((plugin) => !idsToRemove.includes(plugin.id));
        break;
    }
    switch (this.settings.I18N_SORT) {
      case "0":
        this.showPlugins.sort((item1, item2) => {
          return item1.name.localeCompare(item2.name);
        });
        break;
      case "1":
        this.showPlugins.sort((item1, item2) => {
          return item2.name.localeCompare(item1.name);
        });
        break;
    }
    for (const plugin of this.showPlugins) {
      const pluginDir = path2.join(this.basePath, plugin.dir);
      const langDir = path2.join(pluginDir, "lang");
      const langDoc = path2.join(pluginDir, "lang", `${this.settings.I18N_LANGUAGE}.json`);
      const stateDoc = path2.join(pluginDir, "lang", "state.json");
      const isLangDir = fs2.pathExistsSync(langDir);
      const isLangDoc = fs2.pathExistsSync(langDoc);
      let isStateDoc = fs2.pathExistsSync(stateDoc);
      const manifestDoc = path2.join(pluginDir, "manifest.json");
      const mainDoc = path2.join(pluginDir, "main.js");
      const duplicateDoc = path2.join(pluginDir, "duplicate.js");
      const stateObj = new State(stateDoc);
      if (isLangDir && !isStateDoc) {
        try {
          stateObj.insert();
          isStateDoc = fs2.pathExistsSync(stateDoc);
        } catch (error) {
          NoticeError("\u9519\u8BEF", `error`);
        }
      }
      let localTranslationJson;
      let cloudTranslationManifestJson;
      let isPluginsVersionSameMark;
      let isTranslationVersionSameMark = false;
      let latestCloudVersion;
      let translationFormatMark = true;
      if (this.i18n.directoryMark) {
        cloudTranslationManifestJson = this.i18n.directory.find((manifest) => manifest.id === plugin.id);
      }
      if (cloudTranslationManifestJson != void 0) {
        isPluginsVersionSameMark = cloudTranslationManifestJson.translations.find((translation) => translation.pluginVersion === plugin.version) !== void 0 ? true : false;
        latestCloudVersion = isPluginsVersionSameMark ? plugin.version : cloudTranslationManifestJson.translations.slice(-1)[0].pluginVersion;
        const temp = cloudTranslationManifestJson.translations.find((translation) => translation.pluginVersion === latestCloudVersion);
        console.log(temp);
        if (isLangDoc && temp != void 0) {
          isTranslationVersionSameMark = fs2.readJsonSync(langDoc).manifest.version == temp.translationVersion ? false : true;
        }
      }
      if (isLangDoc) {
        try {
          localTranslationJson = fs2.readJsonSync(langDoc);
        } catch (error) {
          translationFormatMark = false;
          NoticeError(`${plugin.name}`, "\u8BD1\u6587\u683C\u5F0F\u9519\u8BEF");
        }
      }
      if (isStateDoc && stateObj.state() && plugin.version != stateObj.pluginVersion()) {
        try {
          fs2.removeSync(duplicateDoc);
          stateObj.reset();
        } catch (error) {
          PNotice("\u9519\u8BEF", error);
        }
      }
      const block = new import_obsidian21.Setting(this.contentEl);
      block.setClass("i18n_modal_item");
      block.nameEl.addClass("i18n_modal_item_title");
      let stateMark;
      if (isLangDoc && stateObj.state() == true && translationFormatMark) {
        const translationJson = fs2.readJSONSync(langDoc);
        if (translationJson.manifest.pluginVersion === plugin.version) {
          stateMark = ["success", "\u5DF2\u7FFB\u8BD1"];
        } else {
          stateMark = ["warning", "\u5DF2\u8FC7\u65F6"];
        }
      } else if (isLangDoc && stateObj.state() == false && translationFormatMark) {
        const translationJson = fs2.readJSONSync(langDoc);
        if (translationJson.manifest.pluginVersion === plugin.version) {
          stateMark = ["error", "\u672A\u7FFB\u8BD1"];
        } else {
          stateMark = ["warning", "\u5DF2\u8FC7\u65F6"];
        }
      } else {
        stateMark = ["error", "\u65E0\u8BD1\u6587"];
      }
      block.nameEl.innerHTML = `
            <span class="i18n_modal_item_state i18n_modal_item_state_${stateMark[0]}">${stateMark[1]}</span>
            <span class="i18n_modal_item_title">${plugin.name}</span> 
            <span class="i18n_modal_item_version" style="color:--simple-blue-2;">(${plugin.version})</span> 
            `;
      if (isLangDoc) {
        if (translationFormatMark) {
          block.descEl.createDiv({ text: `[\u672C\u5730] ${localTranslationJson == null ? void 0 : localTranslationJson.manifest.author} (${localTranslationJson == null ? void 0 : localTranslationJson.manifest.pluginVersion}) ` });
          block.descEl.createDiv({ text: "[\u672C\u5730] \u6B22\u8FCE\u5171\u4EAB\u60A8\u7684\u8BD1\u6587" });
        } else {
          block.descEl.createDiv({ text: "[\u8BD1\u6587] \u8BD1\u6587\u683C\u5F0F\u9519\u8BEF" }).addClass("i18n_color_red");
          block.descEl.createDiv({ text: "[\u8BD1\u6587] \u8BF7\u4ED4\u7EC6\u68C0\u67E5\u8C03\u6574\u6216\u5220\u9664\u540E\u91CD\u8BD5" }).addClass("i18n_color_red");
        }
      } else if (this.i18n.directoryMark && !this.i18n.ignoreMark) {
        if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes(plugin.id)) {
          block.descEl.createDiv({ text: `[\u63D2\u4EF6] \u6B64\u63D2\u4EF6\u53EF\u80FD\u81EA\u5E26\u7FFB\u8BD1\u529F\u80FD` });
          block.descEl.createDiv({ text: "\u200E" });
        }
        if (cloudTranslationManifestJson !== void 0) {
          const temp = cloudTranslationManifestJson.translations.find((translation) => translation.pluginVersion === latestCloudVersion);
          block.descEl.createDiv({ text: `[\u4E91\u7AEF] ${temp == null ? void 0 : temp.author} (${temp == null ? void 0 : temp.translationVersion})` });
          block.descEl.createDiv({ text: "\u200E" });
        } else {
          block.descEl.createDiv({ text: `[\u4E91\u7AEF] \u4E91\u7AEF\u65E0\u53EF\u4E0B\u8F7D\u8BD1\u6587` });
          block.descEl.createDiv({ text: "[\u4E91\u7AEF] \u6B22\u8FCE\u5171\u4EAB\u60A8\u7684\u8BD1\u6587" });
        }
      } else if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes(plugin.id)) {
        block.descEl.createDiv({ text: `[\u63D2\u4EF6] \u6B64\u63D2\u4EF6\u53EF\u80FD\u81EA\u5E26\u7FFB\u8BD1\u529F\u80FD` });
        block.descEl.createDiv({ text: "\u200E" });
      } else {
        block.descEl.createDiv({ text: `[\u672C\u5730] \u60A8\u8FD8\u672A\u63D0\u53D6\u8BD1\u6587` });
        block.descEl.createDiv({ text: "\u200E" });
      }
      if (this.settings.I18N_OPEN_SETTINGS && this.enabledPlugins.has(plugin.id)) {
        const openPluginSetting = new import_obsidian21.ExtraButtonComponent(block.controlEl);
        openPluginSetting.setIcon("settings");
        openPluginSetting.setTooltip("\u6253\u5F00\u63D2\u4EF6\u8BBE\u7F6E");
        openPluginSetting.onClick(() => {
          openPluginSetting.setDisabled(true);
          this.settingPlugins.open();
          this.settingPlugins.openTabById(plugin.id);
          this.close();
        });
      }
      if (true) {
        const openPluginDir = new import_obsidian21.ExtraButtonComponent(block.controlEl);
        openPluginDir.setIcon("folder-open");
        openPluginDir.setTooltip("\u6253\u5F00\u63D2\u4EF6\u76EE\u5F55");
        openPluginDir.onClick(() => {
          openPluginDir.setDisabled(true);
          if (navigator.userAgent.match(/Win/i)) {
            const command = `powershell.exe -Command "Invoke-Item \\"${pluginDir}\\""`;
            (0, import_child_process.exec)(command, (error) => {
              if (error) {
                NoticeOperationResult("\u6253\u5F00\u76EE\u5F55", false, error);
              } else {
                NoticeOperationResult("\u6253\u5F00\u76EE\u5F55", true);
              }
            });
          }
          openPluginDir.setDisabled(false);
        });
      }
      if (isLangDir) {
        const deletePluginDirButton = new import_obsidian21.ExtraButtonComponent(block.controlEl);
        deletePluginDirButton.setIcon("trash");
        deletePluginDirButton.setTooltip("\u5220\u9664\u8BD1\u6587\u76EE\u5F55");
        deletePluginDirButton.onClick(() => {
          deletePluginDirButton.setDisabled(true);
          try {
            if (stateObj.state()) {
              fs2.removeSync(mainDoc);
              fs2.renameSync(duplicateDoc, mainDoc);
              const translationJson = fs2.readJsonSync(langDoc);
              if (translationJson.hasOwnProperty("description")) {
                const manifestJSON = fs2.readJsonSync(manifestDoc);
                manifestJSON.description = translationJson.description.original;
                fs2.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
              }
            }
            fs2.removeSync(langDir);
            this.reloadPlugin(plugin.id);
            NoticeOperationResult("\u5220\u9664\u8BD1\u6587", true);
          } catch (error) {
            NoticeOperationResult("\u5220\u9664\u8BD1\u6587", false, error);
          }
          this.reloadShowData();
        });
      }
      if (this.settings.I18N_EDIT_MODE && isLangDoc) {
        const deletePluginDirButton = new import_obsidian21.ExtraButtonComponent(block.controlEl);
        deletePluginDirButton.setIcon("pencil");
        deletePluginDirButton.setTooltip("\u7F16\u8F91\u8BD1\u6587");
        deletePluginDirButton.onClick(() => {
          deletePluginDirButton.setDisabled(true);
          if (navigator.userAgent.match(/Win/i)) {
            const command = `powershell.exe -Command "Invoke-Item \\"${langDoc}\\""`;
            (0, import_child_process.exec)(command, (error) => {
              if (error) {
                NoticeOperationResult("\u6253\u5F00\u8BD1\u6587", false, error);
              } else {
                NoticeOperationResult("\u6253\u5F00\u8BD1\u6587", true);
              }
            });
          }
          window.open("https://www.json.cn/jsonedit/");
          this.reloadShowData();
        });
      }
      if (this.settings.I18N_SUBMIT_TRANSLATION_MODE && isLangDoc && translationFormatMark) {
        const submitRernslationButton = new import_obsidian21.ExtraButtonComponent(block.controlEl);
        submitRernslationButton.setIcon("cloud-upload");
        submitRernslationButton.setTooltip("\u63D0\u4EA4\u8BD1\u6587");
        submitRernslationButton.onClick(() => {
          try {
            new GitIssueModal(this.app, plugin.id, plugin.version, async () => {
              const translationJson = fs2.readJSONSync(langDoc);
              const titleJson = {
                id: plugin.id,
                author: translationJson.manifest.author,
                translationVersion: translationJson.manifest.version,
                pluginVersion: translationJson.manifest.pluginVersion
              };
              const url = await this.i18n.api.giteeIssue(JSON.stringify(titleJson), JSON.stringify(translationJson));
              if (url != null)
                window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${url}`, "_blank");
            }).open();
          } catch (error) {
            NoticeOperationResult("\u8BD1\u6587\u63D0\u4EA4", false, `${error}`);
          }
        });
      }
      if (this.settings.I18N_MODE_LDT && !isLangDoc) {
        const LDTGenerateButton = new import_obsidian21.ButtonComponent(block.controlEl);
        LDTGenerateButton.setButtonText("\u63D0\u53D6");
        LDTGenerateButton.setTooltip("\u63D0\u53D6\u8BD1\u6587");
        LDTGenerateButton.onClick(() => {
          LDTGenerateButton.setDisabled(true);
          try {
            const mainStr = fs2.readFileSync(mainDoc).toString();
            const manifestJSON = fs2.readJsonSync(manifestDoc);
            const translationJson = generateTranslation(plugin.id, this.settings.I18N_AUTHOR, "1.0.0", plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
            fs2.ensureDirSync(langDir);
            fs2.writeJsonSync(langDoc, translationJson, { spaces: 4 });
            NoticeOperationResult("\u63D0\u53D6", true, "\u5BFC\u822A\u81F3\u63D2\u4EF6\u5B89\u88C5\u76EE\u5F55\n\u624B\u52A8\u7FFB\u8BD1\u60A8\u7684\u8BD1\u6587\n\u6216\u4F7F\u7528\u7F16\u8F91\u6A21\u5F0F");
          } catch (error) {
            NoticeOperationResult("\u63D0\u53D6", false, `${error}`);
          }
          this.reloadShowData();
        });
      }
      if (this.settings.I18N_MODE_NDT && this.i18n.directoryMark && cloudTranslationManifestJson != void 0 && translationFormatMark) {
        try {
          const NDTUpdateButton = new import_obsidian21.ButtonComponent(block.controlEl);
          if (!(isLangDoc && isTranslationVersionSameMark))
            NDTUpdateButton.setClass("i18n_display-none");
          NDTUpdateButton.setButtonText("\u66F4\u65B0");
          NDTUpdateButton.setTooltip(t("NDT_UPDATE_TOOLTIP"));
          NDTUpdateButton.onClick(async () => {
            NDTUpdateButton.setDisabled(true);
            fs2.writeJsonSync(langDoc, await this.i18n.api.translation(plugin.id, latestCloudVersion), { spaces: 4 });
            await this.reloadShowData();
          });
          const NDTDownloadButton = new import_obsidian21.ButtonComponent(block.controlEl);
          if (isLangDoc)
            NDTDownloadButton.setClass("i18n_display-none");
          NDTDownloadButton.setButtonText("\u4E0B\u8F7D");
          NDTDownloadButton.setTooltip(t("NDT_DOWNLOAD_TOOLTIP"));
          NDTDownloadButton.onClick(async () => {
            NDTDownloadButton.setDisabled(true);
            fs2.ensureDirSync(langDir);
            fs2.writeJsonSync(langDoc, await this.i18n.api.translation(plugin.id, latestCloudVersion), { spaces: 4 });
            await this.reloadShowData();
          });
        } catch (error) {
          PNotice("\u9519\u8BEF", error);
        }
      }
      if (this.settings.I18N_MODE_NIT && !isLangDoc) {
        const NITGenerateButton = new import_obsidian21.ButtonComponent(block.controlEl);
        NITGenerateButton.setButtonText(API_TYPES[this.settings.I18N_NIT_API]);
        NITGenerateButton.setTooltip(t("NIT_GENERATE_TOOLTIP"));
        NITGenerateButton.setCta();
        NITGenerateButton.onClick(async () => {
          NITGenerateButton.setDisabled(true);
          try {
            const mainStr = fs2.readFileSync(mainDoc).toString();
            const manifestJSON = fs2.readJsonSync(manifestDoc);
            const translationJson = generateTranslation(plugin.id, this.settings.I18N_AUTHOR, "1.0.0", plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
            const regex = /(['"`])(.*)(\1)/;
            let temp = 0;
            if (this.settings.I18N_NIT_API == "BAIDU") {
              const response = await this.i18n.api.baidu(translationJson.description.original);
              if ("trans_result" in response.json) {
                translationJson.description.translation = response.json["trans_result"][0]["dst"];
              } else {
                translationJson.description.translation = translationJson.description.original;
              }
              await sleep(this.settings.I18N_NIT_API_INTERVAL);
              for (const key in translationJson.dict) {
                NoticeInfo("\u751F\u6210", `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
                const tempArray = key.match(regex);
                if (tempArray != null) {
                  const response2 = await this.i18n.api.baidu(tempArray[2]);
                  if ("trans_result" in response2.json) {
                    translationJson.dict[key] = key.replace(tempArray[2], response2.json["trans_result"][0]["dst"]);
                  } else {
                    translationJson.dict[key] = key;
                  }
                  await sleep(this.settings.I18N_NIT_API_INTERVAL);
                }
              }
            }
            if (this.settings.I18N_NIT_API == "OPENAI") {
              const response = await this.i18n.api.openAI(plugin.name, translationJson.description.original);
              if ("content" in response) {
                translationJson.description.translation = response.content;
              } else {
                translationJson.description.translation = translationJson.description.original;
              }
              await sleep(this.settings.I18N_NIT_API_INTERVAL);
              for (const key in translationJson.dict) {
                NoticeInfo("\u751F\u6210", `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
                const tempArray = key.match(regex);
                if (tempArray != null) {
                  const response2 = await this.i18n.api.openAI(plugin.name, tempArray[2]);
                  if ("content" in response2) {
                    translationJson.dict[key] = key.replace(tempArray[2], response2.content);
                  } else {
                    translationJson.dict[key] = key;
                  }
                  await sleep(this.settings.I18N_NIT_API_INTERVAL);
                }
              }
            }
            fs2.ensureDirSync(langDir);
            fs2.writeJsonSync(langDoc, translationJson, { spaces: 4 });
          } catch (error) {
            NoticeOperationResult("\u4E91\u7AEF\u8BD1\u6587", false, error);
          }
          this.reloadShowData();
        });
      }
      if (isStateDoc && isLangDoc && translationFormatMark) {
        try {
          const TrenslatorButton = new import_obsidian21.ButtonComponent(block.controlEl);
          TrenslatorButton.setButtonText("\u7FFB\u8BD1");
          TrenslatorButton.setTooltip("\u7FFB\u8BD1\u63D2\u4EF6");
          if (!(stateObj.state() == false))
            TrenslatorButton.setClass("i18n_display-none");
          TrenslatorButton.onClick(() => {
            TrenslatorButton.setDisabled(true);
            fs2.copySync(mainDoc, duplicateDoc);
            const translationJson = fs2.readJsonSync(langDoc);
            let mainString = fs2.readFileSync(mainDoc).toString();
            for (const key in translationJson.dict)
              mainString = mainString.replaceAll(key, translationJson.dict[key]);
            fs2.writeFileSync(mainDoc, mainString);
            if (translationJson.hasOwnProperty("description")) {
              const manifestJSON = fs2.readJsonSync(manifestDoc);
              manifestJSON.description = translationJson.description.translation;
              fs2.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
            }
            stateObj.update(true, plugin.version, translationJson.manifest.version);
            if (this.enabledPlugins.has(plugin.id)) {
              this.reloadPlugin(plugin.id);
            }
            NoticeOperationResult("\u7FFB\u8BD1", true, "\u5982\u9047\u7FFB\u8BD1\u540E\u63D2\u4EF6\u5931\u6548\n\u8BF4\u660E\u8BD1\u6587\u53EF\u80FD\u51FA\u73B0\u95EE\u9898\n\u70B9\u51FB\u8FD8\u539F\u5373\u53EF\u6062\u590D\u539F\u72B6");
            this.reloadShowData();
          });
          const RestoreButton = new import_obsidian21.ButtonComponent(block.controlEl);
          RestoreButton.setButtonText("\u8FD8\u539F");
          RestoreButton.setTooltip("\u8FD8\u539F\u63D2\u4EF6");
          if (!(stateObj.state() == true))
            RestoreButton.setClass("i18n_display-none");
          RestoreButton.onClick(() => {
            RestoreButton.setDisabled(true);
            fs2.unlinkSync(mainDoc);
            fs2.renameSync(duplicateDoc, mainDoc);
            const translationJson = fs2.readJsonSync(langDoc);
            if (translationJson.hasOwnProperty("description")) {
              const manifestJSON = fs2.readJsonSync(manifestDoc);
              manifestJSON.description = translationJson.description.original;
              fs2.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
            }
            stateObj.reset();
            if (this.enabledPlugins.has(plugin.id)) {
              this.reloadPlugin(plugin.id);
            }
            NoticeOperationResult("\u8FD8\u539F", true);
            this.reloadShowData();
          });
        } catch (error) {
          NoticeOperationResult("\u7FFB\u8BD1", false, error);
        }
      }
      if (this.developerMode) {
        const test2 = new import_obsidian21.ButtonComponent(block.controlEl);
        test2.setButtonText("\u6D4B\u8BD5");
        test2.onClick(async () => {
          console.log(this.i18n.manifest.id);
        });
      }
    }
  }
  // [重载数据显示]
  async reloadShowData() {
    console.log("\u8C03\u7528\u4E86[\u5237\u65B0]");
    let scrollTop = 0;
    const modalElement = this.contentEl;
    console.log(modalElement);
    scrollTop = modalElement.scrollTop;
    while (this.contentEl.firstChild) {
      this.contentEl.removeChild(this.contentEl.firstChild);
    }
    await this.showData();
    modalElement.scrollTo(0, scrollTop);
  }
  // [开启]
  async onOpen() {
    console.log("\u8C03\u7528\u4E86[\u5F00\u542F]");
    await this.showHead();
    await this.showData();
  }
  // [关闭]
  async onClose() {
    console.log("\u8C03\u7528\u4E86[\u5173\u95ED]");
    this.contentEl.empty();
  }
  async reloadPlugin(id) {
    if (this.enabledPlugins.has(id)) {
      await this.app.plugins.disablePlugin(id);
      await this.app.plugins.enablePlugin(id);
    }
  }
};

// node_modules/.store/uuid@10.0.0/node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
var i;
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/.store/uuid@10.0.0/node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/.store/uuid@10.0.0/node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/.store/uuid@10.0.0/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/main.ts
var I18N = class extends import_obsidian22.Plugin {
  constructor() {
    super(...arguments);
    this.currentPlugin = "";
    this.directoryMark = true;
    this.ignoreMark = true;
    // 自动更新插件(失效)
    this.i18nAutomaticUpdate = (app) => {
      var _a;
      let plugins = [];
      new import_obsidian22.Notice("\u5F00\u59CB\u68C0\u67E5\u66F4\u65B0");
      plugins = Object.values(app.plugins.manifests);
      plugins = plugins.filter((item) => item.id !== "i18n");
      plugins.sort((item1, item2) => {
        return item1.name.localeCompare(item2.name);
      });
      let updateitem = 0;
      for (const plugin of plugins) {
        const pluginDir = path3.join(path3.normalize(app.vault.adapter.getBasePath()), (_a = plugin.dir) != null ? _a : "");
        const langDir = path3.join(pluginDir, "lang");
        const langDoc = path3.join(pluginDir, "lang", `${this.settings.I18N_LANGUAGE}.json`);
        const stateDoc = path3.join(pluginDir, "lang", "state.json");
        const isLangDir = fs3.pathExistsSync(langDir);
        let isStateDoc = fs3.pathExistsSync(stateDoc);
        const mainDoc = path3.join(pluginDir, "main.js");
        const duplicateDoc = path3.join(pluginDir, "duplicate.js");
        const stateObj = new State(stateDoc);
        if (isLangDir && !isStateDoc) {
          try {
            stateObj.insert();
            isStateDoc = fs3.pathExistsSync(stateDoc);
          } catch (error) {
            new import_obsidian22.Notice(`\u26A0 ${error}`);
            console.error(`\u26A0 ${error}`);
          }
        }
        if (isStateDoc && stateObj.state() && plugin.version != stateObj.pluginVersion()) {
          try {
            updateitem = updateitem + 1;
            fs3.removeSync(duplicateDoc);
            stateObj.reset();
            fs3.copySync(mainDoc, duplicateDoc);
            const translationJson = fs3.readJsonSync(langDoc);
            let mainString = fs3.readFileSync(mainDoc).toString();
            for (const key in translationJson.dict)
              mainString = mainString.replaceAll(key, translationJson.dict[key]);
            fs3.writeFileSync(mainDoc, mainString);
            stateObj.update(true, plugin.version, translationJson.manifest.version);
            new import_obsidian22.Notice(t("TRANSLATE_NPTICE"));
          } catch (error) {
            new import_obsidian22.Notice(`\u26A0 ${error}`);
            console.error(`\u26A0 ${error}`);
          }
        }
      }
      if (updateitem == 0) {
        new import_obsidian22.Notice(`\u6CA1\u6709\u9700\u8981\u66F4\u65B0\u7684\u63D2\u4EF6`);
      } else {
        new import_obsidian22.Notice(`\u81EA\u52A8\u66F4\u65B0${updateitem}\u4E2A\u63D2\u4EF6`);
      }
    };
  }
  // 当Obsidian启动时默认调用
  async onload() {
    console.log(
      `%c ${this.manifest.name} %c v${this.manifest.version} `,
      `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`,
      `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`
    );
    (0, import_obsidian22.addIcon)("cloud-upload", `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-upload"><path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/></svg>`);
    (0, import_obsidian22.addIcon)("circle-help", `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`);
    (0, import_obsidian22.addIcon)("i18n_translate", `<svg t="1726147647142" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5625" width="100" height="100"><path d="M213.333333 640v85.333333a85.333333 85.333333 0 0 0 78.933334 85.077334L298.666667 810.666667h128v85.333333H298.666667a170.666667 170.666667 0 0 1-170.666667-170.666667v-85.333333h85.333333z m554.666667-213.333333l187.733333 469.333333h-91.946666l-51.242667-128h-174.506667l-51.157333 128h-91.904L682.666667 426.666667h85.333333z m-42.666667 123.093333L672.128 682.666667h106.325333L725.333333 549.76zM341.333333 85.333333v85.333334h170.666667v298.666666H341.333333v128H256v-128H85.333333V170.666667h170.666667V85.333333h85.333333z m384 42.666667a170.666667 170.666667 0 0 1 170.666667 170.666667v85.333333h-85.333333V298.666667a85.333333 85.333333 0 0 0-85.333334-85.333334h-128V128h128zM256 256H170.666667v128h85.333333V256z m170.666667 0H341.333333v128h85.333334V256z" p-id="5626" fill="#b3b3b3"></path></svg>`);
    (0, import_obsidian22.addIcon)("i18n_qq", `<svg t="1726285705266" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4293" width="100" height="100"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" p-id="4294" fill="#dadada"></path></svg>`);
    await this.loadSettings();
    this.api = new API(this);
    this.firstRun();
    await this.ignoreCache();
    await this.directoryCache();
    this.addRibbonIcon("i18n_translate", "\u7FFB\u8BD1", (evt) => {
      new I18NModal(this.app, this).open();
    });
    this.addSettingTab(new I18nSettingTab(this.app, this));
  }
  // 命周期函数在插件被禁用时触发。
  async onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // 缓存 忽略插件
  async ignoreCache() {
    if (this.settings.I18N_IGNORE && !(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS))
      NoticeWarning("\u5FFD\u7565\u63D2\u4EF6", `\u5F53\u524D\u8BED\u8A00 API \u4E0D\u5B58\u5728`);
    const ignoreTest = await this.api.ignoreTest();
    if (this.settings.I18N_IGNORE && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && ignoreTest) {
      try {
        this.ignorePlugins = await this.api.ignore();
        console.log(this.ignorePlugins);
        NoticeOperationResult("\u5FFD\u7565\u63D2\u4EF6", true);
      } catch (error) {
        this.ignoreMark = false;
        NoticeOperationResult("\u5FFD\u7565\u63D2\u4EF6", false, error);
      }
    } else if (this.settings.I18N_IGNORE && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && !ignoreTest) {
      this.ignoreMark = false;
      NoticeOperationResult("\u5FFD\u7565\u63D2\u4EF6", false, "\u7F51\u7EDC\u5F02\u5E38");
    } else {
      this.ignoreMark = false;
    }
  }
  // 缓存 云端目录
  async directoryCache() {
    if (this.settings.I18N_MODE_NDT && !(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS))
      NoticeWarning("\u4E91\u7AEF\u6A21\u5F0F", `\u5F53\u524D\u8BED\u8A00 API \u4E0D\u5B58\u5728`);
    const directoryTest = await this.api.directoryTest();
    if (this.settings.I18N_MODE_NDT && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && directoryTest) {
      try {
        this.directory = await this.api.directory();
        NoticeOperationResult("\u4E91\u7AEF\u6A21\u5F0F", true);
      } catch (error) {
        this.directoryMark = false;
        NoticeOperationResult("\u4E91\u7AEF\u6A21\u5F0F", false, error);
      }
    } else if (this.settings.I18N_MODE_NDT && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && !directoryTest) {
      this.directoryMark = false;
      NoticeOperationResult("\u4E91\u7AEF\u6A21\u5F0F", false, "\u7F51\u7EDC\u5F02\u5E38");
    } else {
      this.directoryMark = false;
    }
  }
  // 首次运行
  firstRun() {
    if (this.settings.I18N_WIZARD) {
      new WizardModal(this.app, this).open();
      this.settings.I18N_UUID = v4_default();
      this.settings.I18N_WIZARD = false;
      this.saveSettings();
    }
  }
};

// main.ts
var main_default = I18N;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzLy5zdG9yZS91bml2ZXJzYWxpZnlAMi4wLjEvbm9kZV9tb2R1bGVzL3VuaXZlcnNhbGlmeS9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2dyYWNlZnVsLWZzQDQuMi4xMS9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvcG9seWZpbGxzLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZ3JhY2VmdWwtZnNANC4yLjExL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9sZWdhY3ktc3RyZWFtcy5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2dyYWNlZnVsLWZzQDQuMi4xMS9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvY2xvbmUuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9ncmFjZWZ1bC1mc0A0LjIuMTEvbm9kZV9tb2R1bGVzL2dyYWNlZnVsLWZzL2dyYWNlZnVsLWZzLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZnMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9ta2RpcnMvdXRpbHMuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9ta2RpcnMvbWFrZS1kaXIuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9ta2RpcnMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9wYXRoLWV4aXN0cy9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2ZzLWV4dHJhQDExLjIuMC9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3V0aWwvdXRpbWVzLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvdXRpbC9zdGF0LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvY29weS9jb3B5LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvY29weS9jb3B5LXN5bmMuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9jb3B5L2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvcmVtb3ZlL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW1wdHkvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvZmlsZS5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2ZzLWV4dHJhQDExLjIuMC9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2Vuc3VyZS9saW5rLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmstcGF0aHMuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvc3ltbGluay10eXBlLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmsuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9qc29uZmlsZUA2LjEuMC9ub2RlX21vZHVsZXMvanNvbmZpbGUvdXRpbHMuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9qc29uZmlsZUA2LjEuMC9ub2RlX21vZHVsZXMvanNvbmZpbGUvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9qc29uL2pzb25maWxlLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvb3V0cHV0LWZpbGUvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9mcy1leHRyYUAxMS4yLjAvbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9qc29uL291dHB1dC1qc29uLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvanNvbi9vdXRwdXQtanNvbi1zeW5jLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvanNvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2ZzLWV4dHJhQDExLjIuMC9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21vdmUvbW92ZS5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2ZzLWV4dHJhQDExLjIuMC9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21vdmUvbW92ZS1zeW5jLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvZnMtZXh0cmFAMTEuMi4wL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvbW92ZS9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2ZzLWV4dHJhQDExLjIuMC9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2luZGV4LmpzIiwgIm1haW4udHMiLCAic3JjL21haW4udHMiLCAic3JjL3NldHRpbmdzL2RhdGEudHMiLCAic3JjL3NldHRpbmdzL3VpL2luZGV4LnRzIiwgInNyYy9zZXR0aW5ncy91aS9pMThuLWhlbHAudHMiLCAic3JjL3NldHRpbmdzL3VpL2Jhc2Utc2V0dGluZy50cyIsICJzcmMvdXRpbHMudHMiLCAic3JjL3VybC50cyIsICJzcmMvc2V0dGluZ3MvdWkvaTE4bi1sYW5ndWFnZS50cyIsICJzcmMvZGF0YS9kYXRhLnRzIiwgInNyYy9sYW5nL2lueGRleC50cyIsICJzcmMvbGFuZy9sb2NhbGUvemgtY24udHMiLCAic3JjL3NldHRpbmdzL3VpL2kxOG4tbW9kLWxkdC50cyIsICJzcmMvc2V0dGluZ3MvdWkvaTE4bi1tb2QtbmR0LnRzIiwgInNyYy9zZXR0aW5ncy91aS9pMThuLW5kdC1hcGkudHMiLCAic3JjL3NldHRpbmdzL3VpL2kxOG4tbW9kLW5pdC50cyIsICJzcmMvYXBpLnRzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zRXJyb3IuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbnVsbC5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90b0Zvcm1EYXRhLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL0F4aW9zVVJMU2VhcmNoUGFyYW1zLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvdHJhbnNpdGlvbmFsLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9icm93c2VyL2NsYXNzZXMvVVJMU2VhcmNoUGFyYW1zLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9icm93c2VyL2NsYXNzZXMvRm9ybURhdGEuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2Jyb3dzZXIvY2xhc3Nlcy9CbG9iLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9icm93c2VyL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9jb21tb24vdXRpbHMuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3RvVVJMRW5jb2RlZEZvcm0uanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvc0hlYWRlcnMuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VQcm90b2NvbC5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcGVlZG9tZXRlci5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90aHJvdHRsZS5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wcm9ncmVzc0V2ZW50UmVkdWNlci5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbXBvc2VTaWduYWxzLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3RyYWNrU3RyZWFtLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy9mZXRjaC5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMvYWRhcHRlcnMuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9lbnYvZGF0YS5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy92YWxpZGF0b3IuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS9heGlvc0AxLjcuNy9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL0h0dHBTdGF0dXNDb2RlLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvYXhpb3NAMS43Ljcvbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL2F4aW9zQDEuNy43L25vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qcyIsICJzcmMvc2V0dGluZ3MvdWkvaTE4bi1uaXQtYmFpZHUudHMiLCAic3JjL3NldHRpbmdzL3VpL2kxOG4tYXV0aG9yLnRzIiwgInNyYy9zZXR0aW5ncy91aS9pMThuLW9wZW4tc2V0dGluZ3MudHMiLCAic3JjL3NldHRpbmdzL3VpL2kxOG4tbml0LW9wZW5BSS50cyIsICJzcmMvc2V0dGluZ3MvdWkvaTE4bi1lZGl0LW1vZGUudHMiLCAic3JjL3NldHRpbmdzL3VpL2kxOG4tc3VibWl0ZS10cmFuc2xhdGlvbi50cyIsICJzcmMvc2V0dGluZ3MvdWkvaTE4bi1pZ25vcmUudHMiLCAic3JjL3NldHRpbmdzL3VpL2kxOG4tcmUudHMiLCAic3JjL21vZGFsL2kxOG4tbW9kYWwudHMiLCAic3JjL21vZGFsL2dpdC1pc3N1ZS1tb2RhbC50cyIsICJzcmMvbW9kYWwvd2l6YXJkLW1vZGFsLnRzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvdXVpZEAxMC4wLjAvbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCAibm9kZV9tb2R1bGVzLy5zdG9yZS91dWlkQDEwLjAuMC9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JuZy5qcyIsICJub2RlX21vZHVsZXMvLnN0b3JlL3V1aWRAMTAuMC4wL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbmF0aXZlLmpzIiwgIm5vZGVfbW9kdWxlcy8uc3RvcmUvdXVpZEAxMC4wLjAvbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuZnJvbUNhbGxiYWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBpZiAodHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykgZm4uYXBwbHkodGhpcywgYXJncylcbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGFyZ3MucHVzaCgoZXJyLCByZXMpID0+IChlcnIgIT0gbnVsbCkgPyByZWplY3QoZXJyKSA6IHJlc29sdmUocmVzKSlcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJncylcbiAgICAgIH0pXG4gICAgfVxuICB9LCAnbmFtZScsIHsgdmFsdWU6IGZuLm5hbWUgfSlcbn1cblxuZXhwb3J0cy5mcm9tUHJvbWlzZSA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY29uc3QgY2IgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV1cbiAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncylcbiAgICBlbHNlIHtcbiAgICAgIGFyZ3MucG9wKClcbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpLnRoZW4ociA9PiBjYihudWxsLCByKSwgY2IpXG4gICAgfVxuICB9LCAnbmFtZScsIHsgdmFsdWU6IGZuLm5hbWUgfSlcbn1cbiIsICJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnY29uc3RhbnRzJylcblxudmFyIG9yaWdDd2QgPSBwcm9jZXNzLmN3ZFxudmFyIGN3ZCA9IG51bGxcblxudmFyIHBsYXRmb3JtID0gcHJvY2Vzcy5lbnYuR1JBQ0VGVUxfRlNfUExBVEZPUk0gfHwgcHJvY2Vzcy5wbGF0Zm9ybVxuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIWN3ZClcbiAgICBjd2QgPSBvcmlnQ3dkLmNhbGwocHJvY2VzcylcbiAgcmV0dXJuIGN3ZFxufVxudHJ5IHtcbiAgcHJvY2Vzcy5jd2QoKVxufSBjYXRjaCAoZXIpIHt9XG5cbi8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIHVudGlsIG5vZGUuanMgMTIgaXMgcmVxdWlyZWRcbmlmICh0eXBlb2YgcHJvY2Vzcy5jaGRpciA9PT0gJ2Z1bmN0aW9uJykge1xuICB2YXIgY2hkaXIgPSBwcm9jZXNzLmNoZGlyXG4gIHByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZCkge1xuICAgIGN3ZCA9IG51bGxcbiAgICBjaGRpci5jYWxsKHByb2Nlc3MsIGQpXG4gIH1cbiAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikgT2JqZWN0LnNldFByb3RvdHlwZU9mKHByb2Nlc3MuY2hkaXIsIGNoZGlyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoXG5cbmZ1bmN0aW9uIHBhdGNoIChmcykge1xuICAvLyAocmUtKWltcGxlbWVudCBzb21lIHRoaW5ncyB0aGF0IGFyZSBrbm93biBidXN0ZWQgb3IgbWlzc2luZy5cblxuICAvLyBsY2htb2QsIGJyb2tlbiBwcmlvciB0byAwLjYuMlxuICAvLyBiYWNrLXBvcnQgdGhlIGZpeCBoZXJlLlxuICBpZiAoY29uc3RhbnRzLmhhc093blByb3BlcnR5KCdPX1NZTUxJTksnKSAmJlxuICAgICAgcHJvY2Vzcy52ZXJzaW9uLm1hdGNoKC9edjBcXC42XFwuWzAtMl18XnYwXFwuNVxcLi8pKSB7XG4gICAgcGF0Y2hMY2htb2QoZnMpXG4gIH1cblxuICAvLyBsdXRpbWVzIGltcGxlbWVudGF0aW9uLCBvciBuby1vcFxuICBpZiAoIWZzLmx1dGltZXMpIHtcbiAgICBwYXRjaEx1dGltZXMoZnMpXG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtZ3JhY2VmdWwtZnMvaXNzdWVzLzRcbiAgLy8gQ2hvd24gc2hvdWxkIG5vdCBmYWlsIG9uIGVpbnZhbCBvciBlcGVybSBpZiBub24tcm9vdC5cbiAgLy8gSXQgc2hvdWxkIG5vdCBmYWlsIG9uIGVub3N5cyBldmVyLCBhcyB0aGlzIGp1c3QgaW5kaWNhdGVzXG4gIC8vIHRoYXQgYSBmcyBkb2Vzbid0IHN1cHBvcnQgdGhlIGludGVuZGVkIG9wZXJhdGlvbi5cblxuICBmcy5jaG93biA9IGNob3duRml4KGZzLmNob3duKVxuICBmcy5mY2hvd24gPSBjaG93bkZpeChmcy5mY2hvd24pXG4gIGZzLmxjaG93biA9IGNob3duRml4KGZzLmxjaG93bilcblxuICBmcy5jaG1vZCA9IGNobW9kRml4KGZzLmNobW9kKVxuICBmcy5mY2htb2QgPSBjaG1vZEZpeChmcy5mY2htb2QpXG4gIGZzLmxjaG1vZCA9IGNobW9kRml4KGZzLmxjaG1vZClcblxuICBmcy5jaG93blN5bmMgPSBjaG93bkZpeFN5bmMoZnMuY2hvd25TeW5jKVxuICBmcy5mY2hvd25TeW5jID0gY2hvd25GaXhTeW5jKGZzLmZjaG93blN5bmMpXG4gIGZzLmxjaG93blN5bmMgPSBjaG93bkZpeFN5bmMoZnMubGNob3duU3luYylcblxuICBmcy5jaG1vZFN5bmMgPSBjaG1vZEZpeFN5bmMoZnMuY2htb2RTeW5jKVxuICBmcy5mY2htb2RTeW5jID0gY2htb2RGaXhTeW5jKGZzLmZjaG1vZFN5bmMpXG4gIGZzLmxjaG1vZFN5bmMgPSBjaG1vZEZpeFN5bmMoZnMubGNobW9kU3luYylcblxuICBmcy5zdGF0ID0gc3RhdEZpeChmcy5zdGF0KVxuICBmcy5mc3RhdCA9IHN0YXRGaXgoZnMuZnN0YXQpXG4gIGZzLmxzdGF0ID0gc3RhdEZpeChmcy5sc3RhdClcblxuICBmcy5zdGF0U3luYyA9IHN0YXRGaXhTeW5jKGZzLnN0YXRTeW5jKVxuICBmcy5mc3RhdFN5bmMgPSBzdGF0Rml4U3luYyhmcy5mc3RhdFN5bmMpXG4gIGZzLmxzdGF0U3luYyA9IHN0YXRGaXhTeW5jKGZzLmxzdGF0U3luYylcblxuICAvLyBpZiBsY2htb2QvbGNob3duIGRvIG5vdCBleGlzdCwgdGhlbiBtYWtlIHRoZW0gbm8tb3BzXG4gIGlmIChmcy5jaG1vZCAmJiAhZnMubGNobW9kKSB7XG4gICAgZnMubGNobW9kID0gZnVuY3Rpb24gKHBhdGgsIG1vZGUsIGNiKSB7XG4gICAgICBpZiAoY2IpIHByb2Nlc3MubmV4dFRpY2soY2IpXG4gICAgfVxuICAgIGZzLmxjaG1vZFN5bmMgPSBmdW5jdGlvbiAoKSB7fVxuICB9XG4gIGlmIChmcy5jaG93biAmJiAhZnMubGNob3duKSB7XG4gICAgZnMubGNob3duID0gZnVuY3Rpb24gKHBhdGgsIHVpZCwgZ2lkLCBjYikge1xuICAgICAgaWYgKGNiKSBwcm9jZXNzLm5leHRUaWNrKGNiKVxuICAgIH1cbiAgICBmcy5sY2hvd25TeW5jID0gZnVuY3Rpb24gKCkge31cbiAgfVxuXG4gIC8vIG9uIFdpbmRvd3MsIEEvViBzb2Z0d2FyZSBjYW4gbG9jayB0aGUgZGlyZWN0b3J5LCBjYXVzaW5nIHRoaXNcbiAgLy8gdG8gZmFpbCB3aXRoIGFuIEVBQ0NFUyBvciBFUEVSTSBpZiB0aGUgZGlyZWN0b3J5IGNvbnRhaW5zIG5ld2x5XG4gIC8vIGNyZWF0ZWQgZmlsZXMuICBUcnkgYWdhaW4gb24gZmFpbHVyZSwgZm9yIHVwIHRvIDYwIHNlY29uZHMuXG5cbiAgLy8gU2V0IHRoZSB0aW1lb3V0IHRoaXMgbG9uZyBiZWNhdXNlIHNvbWUgV2luZG93cyBBbnRpLVZpcnVzLCBzdWNoIGFzIFBhcml0eVxuICAvLyBiaXQ5LCBtYXkgbG9jayBmaWxlcyBmb3IgdXAgdG8gYSBtaW51dGUsIGNhdXNpbmcgbnBtIHBhY2thZ2UgaW5zdGFsbFxuICAvLyBmYWlsdXJlcy4gQWxzbywgdGFrZSBjYXJlIHRvIHlpZWxkIHRoZSBzY2hlZHVsZXIuIFdpbmRvd3Mgc2NoZWR1bGluZyBnaXZlc1xuICAvLyBDUFUgdG8gYSBidXN5IGxvb3BpbmcgcHJvY2Vzcywgd2hpY2ggY2FuIGNhdXNlIHRoZSBwcm9ncmFtIGNhdXNpbmcgdGhlIGxvY2tcbiAgLy8gY29udGVudGlvbiB0byBiZSBzdGFydmVkIG9mIENQVSBieSBub2RlLCBzbyB0aGUgY29udGVudGlvbiBkb2Vzbid0IHJlc29sdmUuXG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKSB7XG4gICAgZnMucmVuYW1lID0gdHlwZW9mIGZzLnJlbmFtZSAhPT0gJ2Z1bmN0aW9uJyA/IGZzLnJlbmFtZVxuICAgIDogKGZ1bmN0aW9uIChmcyRyZW5hbWUpIHtcbiAgICAgIGZ1bmN0aW9uIHJlbmFtZSAoZnJvbSwgdG8sIGNiKSB7XG4gICAgICAgIHZhciBzdGFydCA9IERhdGUubm93KClcbiAgICAgICAgdmFyIGJhY2tvZmYgPSAwO1xuICAgICAgICBmcyRyZW5hbWUoZnJvbSwgdG8sIGZ1bmN0aW9uIENCIChlcikge1xuICAgICAgICAgIGlmIChlclxuICAgICAgICAgICAgICAmJiAoZXIuY29kZSA9PT0gXCJFQUNDRVNcIiB8fCBlci5jb2RlID09PSBcIkVQRVJNXCIgfHwgZXIuY29kZSA9PT0gXCJFQlVTWVwiKVxuICAgICAgICAgICAgICAmJiBEYXRlLm5vdygpIC0gc3RhcnQgPCA2MDAwMCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgZnMuc3RhdCh0bywgZnVuY3Rpb24gKHN0YXRlciwgc3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGVyICYmIHN0YXRlci5jb2RlID09PSBcIkVOT0VOVFwiKVxuICAgICAgICAgICAgICAgICAgZnMkcmVuYW1lKGZyb20sIHRvLCBDQik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgY2IoZXIpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LCBiYWNrb2ZmKVxuICAgICAgICAgICAgaWYgKGJhY2tvZmYgPCAxMDApXG4gICAgICAgICAgICAgIGJhY2tvZmYgKz0gMTA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjYikgY2IoZXIpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVuYW1lLCBmcyRyZW5hbWUpXG4gICAgICByZXR1cm4gcmVuYW1lXG4gICAgfSkoZnMucmVuYW1lKVxuICB9XG5cbiAgLy8gaWYgcmVhZCgpIHJldHVybnMgRUFHQUlOLCB0aGVuIGp1c3QgdHJ5IGl0IGFnYWluLlxuICBmcy5yZWFkID0gdHlwZW9mIGZzLnJlYWQgIT09ICdmdW5jdGlvbicgPyBmcy5yZWFkXG4gIDogKGZ1bmN0aW9uIChmcyRyZWFkKSB7XG4gICAgZnVuY3Rpb24gcmVhZCAoZmQsIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvc2l0aW9uLCBjYWxsYmFja18pIHtcbiAgICAgIHZhciBjYWxsYmFja1xuICAgICAgaWYgKGNhbGxiYWNrXyAmJiB0eXBlb2YgY2FsbGJhY2tfID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBlYWdDb3VudGVyID0gMFxuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uIChlciwgXywgX18pIHtcbiAgICAgICAgICBpZiAoZXIgJiYgZXIuY29kZSA9PT0gJ0VBR0FJTicgJiYgZWFnQ291bnRlciA8IDEwKSB7XG4gICAgICAgICAgICBlYWdDb3VudGVyICsrXG4gICAgICAgICAgICByZXR1cm4gZnMkcmVhZC5jYWxsKGZzLCBmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFja18uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnMkcmVhZC5jYWxsKGZzLCBmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICAgIH1cblxuICAgIC8vIFRoaXMgZW5zdXJlcyBgdXRpbC5wcm9taXNpZnlgIHdvcmtzIGFzIGl0IGRvZXMgZm9yIG5hdGl2ZSBgZnMucmVhZGAuXG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlYWQsIGZzJHJlYWQpXG4gICAgcmV0dXJuIHJlYWRcbiAgfSkoZnMucmVhZClcblxuICBmcy5yZWFkU3luYyA9IHR5cGVvZiBmcy5yZWFkU3luYyAhPT0gJ2Z1bmN0aW9uJyA/IGZzLnJlYWRTeW5jXG4gIDogKGZ1bmN0aW9uIChmcyRyZWFkU3luYykgeyByZXR1cm4gZnVuY3Rpb24gKGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbikge1xuICAgIHZhciBlYWdDb3VudGVyID0gMFxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZnMkcmVhZFN5bmMuY2FsbChmcywgZmQsIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvc2l0aW9uKVxuICAgICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgICAgaWYgKGVyLmNvZGUgPT09ICdFQUdBSU4nICYmIGVhZ0NvdW50ZXIgPCAxMCkge1xuICAgICAgICAgIGVhZ0NvdW50ZXIgKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIHRocm93IGVyXG4gICAgICB9XG4gICAgfVxuICB9fSkoZnMucmVhZFN5bmMpXG5cbiAgZnVuY3Rpb24gcGF0Y2hMY2htb2QgKGZzKSB7XG4gICAgZnMubGNobW9kID0gZnVuY3Rpb24gKHBhdGgsIG1vZGUsIGNhbGxiYWNrKSB7XG4gICAgICBmcy5vcGVuKCBwYXRoXG4gICAgICAgICAgICAgLCBjb25zdGFudHMuT19XUk9OTFkgfCBjb25zdGFudHMuT19TWU1MSU5LXG4gICAgICAgICAgICAgLCBtb2RlXG4gICAgICAgICAgICAgLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhlcnIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgLy8gcHJlZmVyIHRvIHJldHVybiB0aGUgY2htb2QgZXJyb3IsIGlmIG9uZSBvY2N1cnMsXG4gICAgICAgIC8vIGJ1dCBzdGlsbCB0cnkgdG8gY2xvc2UsIGFuZCByZXBvcnQgY2xvc2luZyBlcnJvcnMgaWYgdGhleSBvY2N1ci5cbiAgICAgICAgZnMuZmNobW9kKGZkLCBtb2RlLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgZnMuY2xvc2UoZmQsIGZ1bmN0aW9uKGVycjIpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyIHx8IGVycjIpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnMubGNobW9kU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBtb2RlKSB7XG4gICAgICB2YXIgZmQgPSBmcy5vcGVuU3luYyhwYXRoLCBjb25zdGFudHMuT19XUk9OTFkgfCBjb25zdGFudHMuT19TWU1MSU5LLCBtb2RlKVxuXG4gICAgICAvLyBwcmVmZXIgdG8gcmV0dXJuIHRoZSBjaG1vZCBlcnJvciwgaWYgb25lIG9jY3VycyxcbiAgICAgIC8vIGJ1dCBzdGlsbCB0cnkgdG8gY2xvc2UsIGFuZCByZXBvcnQgY2xvc2luZyBlcnJvcnMgaWYgdGhleSBvY2N1ci5cbiAgICAgIHZhciB0aHJldyA9IHRydWVcbiAgICAgIHZhciByZXRcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldCA9IGZzLmZjaG1vZFN5bmMoZmQsIG1vZGUpXG4gICAgICAgIHRocmV3ID0gZmFsc2VcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmICh0aHJldykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmcy5jbG9zZVN5bmMoZmQpXG4gICAgICAgICAgfSBjYXRjaCAoZXIpIHt9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuY2xvc2VTeW5jKGZkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGF0Y2hMdXRpbWVzIChmcykge1xuICAgIGlmIChjb25zdGFudHMuaGFzT3duUHJvcGVydHkoXCJPX1NZTUxJTktcIikgJiYgZnMuZnV0aW1lcykge1xuICAgICAgZnMubHV0aW1lcyA9IGZ1bmN0aW9uIChwYXRoLCBhdCwgbXQsIGNiKSB7XG4gICAgICAgIGZzLm9wZW4ocGF0aCwgY29uc3RhbnRzLk9fU1lNTElOSywgZnVuY3Rpb24gKGVyLCBmZCkge1xuICAgICAgICAgIGlmIChlcikge1xuICAgICAgICAgICAgaWYgKGNiKSBjYihlcilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBmcy5mdXRpbWVzKGZkLCBhdCwgbXQsIGZ1bmN0aW9uIChlcikge1xuICAgICAgICAgICAgZnMuY2xvc2UoZmQsIGZ1bmN0aW9uIChlcjIpIHtcbiAgICAgICAgICAgICAgaWYgKGNiKSBjYihlciB8fCBlcjIpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGZzLmx1dGltZXNTeW5jID0gZnVuY3Rpb24gKHBhdGgsIGF0LCBtdCkge1xuICAgICAgICB2YXIgZmQgPSBmcy5vcGVuU3luYyhwYXRoLCBjb25zdGFudHMuT19TWU1MSU5LKVxuICAgICAgICB2YXIgcmV0XG4gICAgICAgIHZhciB0aHJldyA9IHRydWVcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXQgPSBmcy5mdXRpbWVzU3luYyhmZCwgYXQsIG10KVxuICAgICAgICAgIHRocmV3ID0gZmFsc2VcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAodGhyZXcpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGZzLmNsb3NlU3luYyhmZClcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVyKSB7fVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5jbG9zZVN5bmMoZmQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXRcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoZnMuZnV0aW1lcykge1xuICAgICAgZnMubHV0aW1lcyA9IGZ1bmN0aW9uIChfYSwgX2IsIF9jLCBjYikgeyBpZiAoY2IpIHByb2Nlc3MubmV4dFRpY2soY2IpIH1cbiAgICAgIGZzLmx1dGltZXNTeW5jID0gZnVuY3Rpb24gKCkge31cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaG1vZEZpeCAob3JpZykge1xuICAgIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgbW9kZSwgY2IpIHtcbiAgICAgIHJldHVybiBvcmlnLmNhbGwoZnMsIHRhcmdldCwgbW9kZSwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICAgIGlmIChjaG93bkVyT2soZXIpKSBlciA9IG51bGxcbiAgICAgICAgaWYgKGNiKSBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNobW9kRml4U3luYyAob3JpZykge1xuICAgIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgbW9kZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCBtb2RlKVxuICAgICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgICAgaWYgKCFjaG93bkVyT2soZXIpKSB0aHJvdyBlclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgZnVuY3Rpb24gY2hvd25GaXggKG9yaWcpIHtcbiAgICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHVpZCwgZ2lkLCBjYikge1xuICAgICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCB1aWQsIGdpZCwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICAgIGlmIChjaG93bkVyT2soZXIpKSBlciA9IG51bGxcbiAgICAgICAgaWYgKGNiKSBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNob3duRml4U3luYyAob3JpZykge1xuICAgIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgdWlkLCBnaWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBvcmlnLmNhbGwoZnMsIHRhcmdldCwgdWlkLCBnaWQpXG4gICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICBpZiAoIWNob3duRXJPayhlcikpIHRocm93IGVyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RhdEZpeCAob3JpZykge1xuICAgIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgICAvLyBPbGRlciB2ZXJzaW9ucyBvZiBOb2RlIGVycm9uZW91c2x5IHJldHVybmVkIHNpZ25lZCBpbnRlZ2VycyBmb3JcbiAgICAvLyB1aWQgKyBnaWQuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMsIGNiKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2IgPSBvcHRpb25zXG4gICAgICAgIG9wdGlvbnMgPSBudWxsXG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjYWxsYmFjayAoZXIsIHN0YXRzKSB7XG4gICAgICAgIGlmIChzdGF0cykge1xuICAgICAgICAgIGlmIChzdGF0cy51aWQgPCAwKSBzdGF0cy51aWQgKz0gMHgxMDAwMDAwMDBcbiAgICAgICAgICBpZiAoc3RhdHMuZ2lkIDwgMCkgc3RhdHMuZ2lkICs9IDB4MTAwMDAwMDAwXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNiKSBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgICByZXR1cm4gb3B0aW9ucyA/IG9yaWcuY2FsbChmcywgdGFyZ2V0LCBvcHRpb25zLCBjYWxsYmFjaylcbiAgICAgICAgOiBvcmlnLmNhbGwoZnMsIHRhcmdldCwgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RhdEZpeFN5bmMgKG9yaWcpIHtcbiAgICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gICAgLy8gT2xkZXIgdmVyc2lvbnMgb2YgTm9kZSBlcnJvbmVvdXNseSByZXR1cm5lZCBzaWduZWQgaW50ZWdlcnMgZm9yXG4gICAgLy8gdWlkICsgZ2lkLlxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgICB2YXIgc3RhdHMgPSBvcHRpb25zID8gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIG9wdGlvbnMpXG4gICAgICAgIDogb3JpZy5jYWxsKGZzLCB0YXJnZXQpXG4gICAgICBpZiAoc3RhdHMpIHtcbiAgICAgICAgaWYgKHN0YXRzLnVpZCA8IDApIHN0YXRzLnVpZCArPSAweDEwMDAwMDAwMFxuICAgICAgICBpZiAoc3RhdHMuZ2lkIDwgMCkgc3RhdHMuZ2lkICs9IDB4MTAwMDAwMDAwXG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdHM7XG4gICAgfVxuICB9XG5cbiAgLy8gRU5PU1lTIG1lYW5zIHRoYXQgdGhlIGZzIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgb3AuIEp1c3QgaWdub3JlXG4gIC8vIHRoYXQsIGJlY2F1c2UgaXQgZG9lc24ndCBtYXR0ZXIuXG4gIC8vXG4gIC8vIGlmIHRoZXJlJ3Mgbm8gZ2V0dWlkLCBvciBpZiBnZXR1aWQoKSBpcyBzb21ldGhpbmcgb3RoZXJcbiAgLy8gdGhhbiAwLCBhbmQgdGhlIGVycm9yIGlzIEVJTlZBTCBvciBFUEVSTSwgdGhlbiBqdXN0IGlnbm9yZVxuICAvLyBpdC5cbiAgLy9cbiAgLy8gVGhpcyBzcGVjaWZpYyBjYXNlIGlzIGEgc2lsZW50IGZhaWx1cmUgaW4gY3AsIGluc3RhbGwsIHRhcixcbiAgLy8gYW5kIG1vc3Qgb3RoZXIgdW5peCB0b29scyB0aGF0IG1hbmFnZSBwZXJtaXNzaW9ucy5cbiAgLy9cbiAgLy8gV2hlbiBydW5uaW5nIGFzIHJvb3QsIG9yIGlmIG90aGVyIHR5cGVzIG9mIGVycm9ycyBhcmVcbiAgLy8gZW5jb3VudGVyZWQsIHRoZW4gaXQncyBzdHJpY3QuXG4gIGZ1bmN0aW9uIGNob3duRXJPayAoZXIpIHtcbiAgICBpZiAoIWVyKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGlmIChlci5jb2RlID09PSBcIkVOT1NZU1wiKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIHZhciBub25yb290ID0gIXByb2Nlc3MuZ2V0dWlkIHx8IHByb2Nlc3MuZ2V0dWlkKCkgIT09IDBcbiAgICBpZiAobm9ucm9vdCkge1xuICAgICAgaWYgKGVyLmNvZGUgPT09IFwiRUlOVkFMXCIgfHwgZXIuY29kZSA9PT0gXCJFUEVSTVwiKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iLCAidmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpLlN0cmVhbVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxlZ2FjeVxuXG5mdW5jdGlvbiBsZWdhY3kgKGZzKSB7XG4gIHJldHVybiB7XG4gICAgUmVhZFN0cmVhbTogUmVhZFN0cmVhbSxcbiAgICBXcml0ZVN0cmVhbTogV3JpdGVTdHJlYW1cbiAgfVxuXG4gIGZ1bmN0aW9uIFJlYWRTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVhZFN0cmVhbSkpIHJldHVybiBuZXcgUmVhZFN0cmVhbShwYXRoLCBvcHRpb25zKTtcblxuICAgIFN0cmVhbS5jYWxsKHRoaXMpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLmZkID0gbnVsbDtcbiAgICB0aGlzLnJlYWRhYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5mbGFncyA9ICdyJztcbiAgICB0aGlzLm1vZGUgPSA0Mzg7IC8qPTA2NjYqL1xuICAgIHRoaXMuYnVmZmVyU2l6ZSA9IDY0ICogMTAyNDtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLy8gTWl4aW4gb3B0aW9ucyBpbnRvIHRoaXNcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5jb2RpbmcpIHRoaXMuc2V0RW5jb2RpbmcodGhpcy5lbmNvZGluZyk7XG5cbiAgICBpZiAodGhpcy5zdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoJ251bWJlcicgIT09IHR5cGVvZiB0aGlzLnN0YXJ0KSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignc3RhcnQgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5lbmQgPSBJbmZpbml0eTtcbiAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgIT09IHR5cGVvZiB0aGlzLmVuZCkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ2VuZCBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnN0YXJ0ID4gdGhpcy5lbmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBtdXN0IGJlIDw9IGVuZCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBvcyA9IHRoaXMuc3RhcnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmQgIT09IG51bGwpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuX3JlYWQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZzLm9wZW4odGhpcy5wYXRoLCB0aGlzLmZsYWdzLCB0aGlzLm1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgICBzZWxmLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5mZCA9IGZkO1xuICAgICAgc2VsZi5lbWl0KCdvcGVuJywgZmQpO1xuICAgICAgc2VsZi5fcmVhZCgpO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBXcml0ZVN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBXcml0ZVN0cmVhbSkpIHJldHVybiBuZXcgV3JpdGVTdHJlYW0ocGF0aCwgb3B0aW9ucyk7XG5cbiAgICBTdHJlYW0uY2FsbCh0aGlzKTtcblxuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5mZCA9IG51bGw7XG4gICAgdGhpcy53cml0YWJsZSA9IHRydWU7XG5cbiAgICB0aGlzLmZsYWdzID0gJ3cnO1xuICAgIHRoaXMuZW5jb2RpbmcgPSAnYmluYXJ5JztcbiAgICB0aGlzLm1vZGUgPSA0Mzg7IC8qPTA2NjYqL1xuICAgIHRoaXMuYnl0ZXNXcml0dGVuID0gMDtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLy8gTWl4aW4gb3B0aW9ucyBpbnRvIHRoaXNcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5zdGFydCkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ3N0YXJ0IG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXJ0IDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0YXJ0IG11c3QgYmUgPj0gemVybycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBvcyA9IHRoaXMuc3RhcnQ7XG4gICAgfVxuXG4gICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gICAgdGhpcy5fcXVldWUgPSBbXTtcblxuICAgIGlmICh0aGlzLmZkID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9vcGVuID0gZnMub3BlbjtcbiAgICAgIHRoaXMuX3F1ZXVlLnB1c2goW3RoaXMuX29wZW4sIHRoaXMucGF0aCwgdGhpcy5mbGFncywgdGhpcy5tb2RlLCB1bmRlZmluZWRdKTtcbiAgICAgIHRoaXMuZmx1c2goKTtcbiAgICB9XG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVxuXG52YXIgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqLl9fcHJvdG9fX1xufVxuXG5mdW5jdGlvbiBjbG9uZSAob2JqKSB7XG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIG9ialxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgdmFyIGNvcHkgPSB7IF9fcHJvdG9fXzogZ2V0UHJvdG90eXBlT2Yob2JqKSB9XG4gIGVsc2VcbiAgICB2YXIgY29weSA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb3B5LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpKVxuICB9KVxuXG4gIHJldHVybiBjb3B5XG59XG4iLCAidmFyIGZzID0gcmVxdWlyZSgnZnMnKVxudmFyIHBvbHlmaWxscyA9IHJlcXVpcmUoJy4vcG9seWZpbGxzLmpzJylcbnZhciBsZWdhY3kgPSByZXF1aXJlKCcuL2xlZ2FjeS1zdHJlYW1zLmpzJylcbnZhciBjbG9uZSA9IHJlcXVpcmUoJy4vY2xvbmUuanMnKVxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAtIG5vZGUgMC54IHBvbHlmaWxsICovXG52YXIgZ3JhY2VmdWxRdWV1ZVxudmFyIHByZXZpb3VzU3ltYm9sXG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlIC0gbm9kZSAwLnggcG9seWZpbGwgKi9cbmlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuZm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGdyYWNlZnVsUXVldWUgPSBTeW1ib2wuZm9yKCdncmFjZWZ1bC1mcy5xdWV1ZScpXG4gIC8vIFRoaXMgaXMgdXNlZCBpbiB0ZXN0aW5nIGJ5IGZ1dHVyZSB2ZXJzaW9uc1xuICBwcmV2aW91c1N5bWJvbCA9IFN5bWJvbC5mb3IoJ2dyYWNlZnVsLWZzLnByZXZpb3VzJylcbn0gZWxzZSB7XG4gIGdyYWNlZnVsUXVldWUgPSAnX19fZ3JhY2VmdWwtZnMucXVldWUnXG4gIHByZXZpb3VzU3ltYm9sID0gJ19fX2dyYWNlZnVsLWZzLnByZXZpb3VzJ1xufVxuXG5mdW5jdGlvbiBub29wICgpIHt9XG5cbmZ1bmN0aW9uIHB1Ymxpc2hRdWV1ZShjb250ZXh0LCBxdWV1ZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udGV4dCwgZ3JhY2VmdWxRdWV1ZSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcXVldWVcbiAgICB9XG4gIH0pXG59XG5cbnZhciBkZWJ1ZyA9IG5vb3BcbmlmICh1dGlsLmRlYnVnbG9nKVxuICBkZWJ1ZyA9IHV0aWwuZGVidWdsb2coJ2dmczQnKVxuZWxzZSBpZiAoL1xcYmdmczRcXGIvaS50ZXN0KHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJycpKVxuICBkZWJ1ZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtID0gdXRpbC5mb3JtYXQuYXBwbHkodXRpbCwgYXJndW1lbnRzKVxuICAgIG0gPSAnR0ZTNDogJyArIG0uc3BsaXQoL1xcbi8pLmpvaW4oJ1xcbkdGUzQ6ICcpXG4gICAgY29uc29sZS5lcnJvcihtKVxuICB9XG5cbi8vIE9uY2UgdGltZSBpbml0aWFsaXphdGlvblxuaWYgKCFmc1tncmFjZWZ1bFF1ZXVlXSkge1xuICAvLyBUaGlzIHF1ZXVlIGNhbiBiZSBzaGFyZWQgYnkgbXVsdGlwbGUgbG9hZGVkIGluc3RhbmNlc1xuICB2YXIgcXVldWUgPSBnbG9iYWxbZ3JhY2VmdWxRdWV1ZV0gfHwgW11cbiAgcHVibGlzaFF1ZXVlKGZzLCBxdWV1ZSlcblxuICAvLyBQYXRjaCBmcy5jbG9zZS9jbG9zZVN5bmMgdG8gc2hhcmVkIHF1ZXVlIHZlcnNpb24sIGJlY2F1c2Ugd2UgbmVlZFxuICAvLyB0byByZXRyeSgpIHdoZW5ldmVyIGEgY2xvc2UgaGFwcGVucyAqYW55d2hlcmUqIGluIHRoZSBwcm9ncmFtLlxuICAvLyBUaGlzIGlzIGVzc2VudGlhbCB3aGVuIG11bHRpcGxlIGdyYWNlZnVsLWZzIGluc3RhbmNlcyBhcmVcbiAgLy8gaW4gcGxheSBhdCB0aGUgc2FtZSB0aW1lLlxuICBmcy5jbG9zZSA9IChmdW5jdGlvbiAoZnMkY2xvc2UpIHtcbiAgICBmdW5jdGlvbiBjbG9zZSAoZmQsIGNiKSB7XG4gICAgICByZXR1cm4gZnMkY2xvc2UuY2FsbChmcywgZmQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiB1c2VzIHRoZSBncmFjZWZ1bC1mcyBzaGFyZWQgcXVldWVcbiAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICByZXNldFF1ZXVlKClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xvc2UsIHByZXZpb3VzU3ltYm9sLCB7XG4gICAgICB2YWx1ZTogZnMkY2xvc2VcbiAgICB9KVxuICAgIHJldHVybiBjbG9zZVxuICB9KShmcy5jbG9zZSlcblxuICBmcy5jbG9zZVN5bmMgPSAoZnVuY3Rpb24gKGZzJGNsb3NlU3luYykge1xuICAgIGZ1bmN0aW9uIGNsb3NlU3luYyAoZmQpIHtcbiAgICAgIC8vIFRoaXMgZnVuY3Rpb24gdXNlcyB0aGUgZ3JhY2VmdWwtZnMgc2hhcmVkIHF1ZXVlXG4gICAgICBmcyRjbG9zZVN5bmMuYXBwbHkoZnMsIGFyZ3VtZW50cylcbiAgICAgIHJlc2V0UXVldWUoKVxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbG9zZVN5bmMsIHByZXZpb3VzU3ltYm9sLCB7XG4gICAgICB2YWx1ZTogZnMkY2xvc2VTeW5jXG4gICAgfSlcbiAgICByZXR1cm4gY2xvc2VTeW5jXG4gIH0pKGZzLmNsb3NlU3luYylcblxuICBpZiAoL1xcYmdmczRcXGIvaS50ZXN0KHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJycpKSB7XG4gICAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZGVidWcoZnNbZ3JhY2VmdWxRdWV1ZV0pXG4gICAgICByZXF1aXJlKCdhc3NlcnQnKS5lcXVhbChmc1tncmFjZWZ1bFF1ZXVlXS5sZW5ndGgsIDApXG4gICAgfSlcbiAgfVxufVxuXG5pZiAoIWdsb2JhbFtncmFjZWZ1bFF1ZXVlXSkge1xuICBwdWJsaXNoUXVldWUoZ2xvYmFsLCBmc1tncmFjZWZ1bFF1ZXVlXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2goY2xvbmUoZnMpKVxuaWYgKHByb2Nlc3MuZW52LlRFU1RfR1JBQ0VGVUxfRlNfR0xPQkFMX1BBVENIICYmICFmcy5fX3BhdGNoZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHBhdGNoKGZzKVxuICAgIGZzLl9fcGF0Y2hlZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIHBhdGNoIChmcykge1xuICAvLyBFdmVyeXRoaW5nIHRoYXQgcmVmZXJlbmNlcyB0aGUgb3BlbigpIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIGluIGhlcmVcbiAgcG9seWZpbGxzKGZzKVxuICBmcy5ncmFjZWZ1bGlmeSA9IHBhdGNoXG5cbiAgZnMuY3JlYXRlUmVhZFN0cmVhbSA9IGNyZWF0ZVJlYWRTdHJlYW1cbiAgZnMuY3JlYXRlV3JpdGVTdHJlYW0gPSBjcmVhdGVXcml0ZVN0cmVhbVxuICB2YXIgZnMkcmVhZEZpbGUgPSBmcy5yZWFkRmlsZVxuICBmcy5yZWFkRmlsZSA9IHJlYWRGaWxlXG4gIGZ1bmN0aW9uIHJlYWRGaWxlIChwYXRoLCBvcHRpb25zLCBjYikge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gb3B0aW9ucywgb3B0aW9ucyA9IG51bGxcblxuICAgIHJldHVybiBnbyRyZWFkRmlsZShwYXRoLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJHJlYWRGaWxlIChwYXRoLCBvcHRpb25zLCBjYiwgc3RhcnRUaW1lKSB7XG4gICAgICByZXR1cm4gZnMkcmVhZEZpbGUocGF0aCwgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyRyZWFkRmlsZSwgW3BhdGgsIG9wdGlvbnMsIGNiXSwgZXJyLCBzdGFydFRpbWUgfHwgRGF0ZS5ub3coKSwgRGF0ZS5ub3coKV0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdmFyIGZzJHdyaXRlRmlsZSA9IGZzLndyaXRlRmlsZVxuICBmcy53cml0ZUZpbGUgPSB3cml0ZUZpbGVcbiAgZnVuY3Rpb24gd3JpdGVGaWxlIChwYXRoLCBkYXRhLCBvcHRpb25zLCBjYikge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gb3B0aW9ucywgb3B0aW9ucyA9IG51bGxcblxuICAgIHJldHVybiBnbyR3cml0ZUZpbGUocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpXG5cbiAgICBmdW5jdGlvbiBnbyR3cml0ZUZpbGUgKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiLCBzdGFydFRpbWUpIHtcbiAgICAgIHJldHVybiBmcyR3cml0ZUZpbGUocGF0aCwgZGF0YSwgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyR3cml0ZUZpbGUsIFtwYXRoLCBkYXRhLCBvcHRpb25zLCBjYl0sIGVyciwgc3RhcnRUaW1lIHx8IERhdGUubm93KCksIERhdGUubm93KCldKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBmcyRhcHBlbmRGaWxlID0gZnMuYXBwZW5kRmlsZVxuICBpZiAoZnMkYXBwZW5kRmlsZSlcbiAgICBmcy5hcHBlbmRGaWxlID0gYXBwZW5kRmlsZVxuICBmdW5jdGlvbiBhcHBlbmRGaWxlIChwYXRoLCBkYXRhLCBvcHRpb25zLCBjYikge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gb3B0aW9ucywgb3B0aW9ucyA9IG51bGxcblxuICAgIHJldHVybiBnbyRhcHBlbmRGaWxlKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKVxuXG4gICAgZnVuY3Rpb24gZ28kYXBwZW5kRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IsIHN0YXJ0VGltZSkge1xuICAgICAgcmV0dXJuIGZzJGFwcGVuZEZpbGUocGF0aCwgZGF0YSwgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyRhcHBlbmRGaWxlLCBbcGF0aCwgZGF0YSwgb3B0aW9ucywgY2JdLCBlcnIsIHN0YXJ0VGltZSB8fCBEYXRlLm5vdygpLCBEYXRlLm5vdygpXSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkY29weUZpbGUgPSBmcy5jb3B5RmlsZVxuICBpZiAoZnMkY29weUZpbGUpXG4gICAgZnMuY29weUZpbGUgPSBjb3B5RmlsZVxuICBmdW5jdGlvbiBjb3B5RmlsZSAoc3JjLCBkZXN0LCBmbGFncywgY2IpIHtcbiAgICBpZiAodHlwZW9mIGZsYWdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYiA9IGZsYWdzXG4gICAgICBmbGFncyA9IDBcbiAgICB9XG4gICAgcmV0dXJuIGdvJGNvcHlGaWxlKHNyYywgZGVzdCwgZmxhZ3MsIGNiKVxuXG4gICAgZnVuY3Rpb24gZ28kY29weUZpbGUgKHNyYywgZGVzdCwgZmxhZ3MsIGNiLCBzdGFydFRpbWUpIHtcbiAgICAgIHJldHVybiBmcyRjb3B5RmlsZShzcmMsIGRlc3QsIGZsYWdzLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJGNvcHlGaWxlLCBbc3JjLCBkZXN0LCBmbGFncywgY2JdLCBlcnIsIHN0YXJ0VGltZSB8fCBEYXRlLm5vdygpLCBEYXRlLm5vdygpXSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkcmVhZGRpciA9IGZzLnJlYWRkaXJcbiAgZnMucmVhZGRpciA9IHJlYWRkaXJcbiAgdmFyIG5vUmVhZGRpck9wdGlvblZlcnNpb25zID0gL152WzAtNV1cXC4vXG4gIGZ1bmN0aW9uIHJlYWRkaXIgKHBhdGgsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBvcHRpb25zLCBvcHRpb25zID0gbnVsbFxuXG4gICAgdmFyIGdvJHJlYWRkaXIgPSBub1JlYWRkaXJPcHRpb25WZXJzaW9ucy50ZXN0KHByb2Nlc3MudmVyc2lvbilcbiAgICAgID8gZnVuY3Rpb24gZ28kcmVhZGRpciAocGF0aCwgb3B0aW9ucywgY2IsIHN0YXJ0VGltZSkge1xuICAgICAgICByZXR1cm4gZnMkcmVhZGRpcihwYXRoLCBmcyRyZWFkZGlyQ2FsbGJhY2soXG4gICAgICAgICAgcGF0aCwgb3B0aW9ucywgY2IsIHN0YXJ0VGltZVxuICAgICAgICApKVxuICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiBnbyRyZWFkZGlyIChwYXRoLCBvcHRpb25zLCBjYiwgc3RhcnRUaW1lKSB7XG4gICAgICAgIHJldHVybiBmcyRyZWFkZGlyKHBhdGgsIG9wdGlvbnMsIGZzJHJlYWRkaXJDYWxsYmFjayhcbiAgICAgICAgICBwYXRoLCBvcHRpb25zLCBjYiwgc3RhcnRUaW1lXG4gICAgICAgICkpXG4gICAgICB9XG5cbiAgICByZXR1cm4gZ28kcmVhZGRpcihwYXRoLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGZzJHJlYWRkaXJDYWxsYmFjayAocGF0aCwgb3B0aW9ucywgY2IsIHN0YXJ0VGltZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIGZpbGVzKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW1xuICAgICAgICAgICAgZ28kcmVhZGRpcixcbiAgICAgICAgICAgIFtwYXRoLCBvcHRpb25zLCBjYl0sXG4gICAgICAgICAgICBlcnIsXG4gICAgICAgICAgICBzdGFydFRpbWUgfHwgRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIERhdGUubm93KClcbiAgICAgICAgICBdKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoZmlsZXMgJiYgZmlsZXMuc29ydClcbiAgICAgICAgICAgIGZpbGVzLnNvcnQoKVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGNiLmNhbGwodGhpcywgZXJyLCBmaWxlcylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChwcm9jZXNzLnZlcnNpb24uc3Vic3RyKDAsIDQpID09PSAndjAuOCcpIHtcbiAgICB2YXIgbGVnU3RyZWFtcyA9IGxlZ2FjeShmcylcbiAgICBSZWFkU3RyZWFtID0gbGVnU3RyZWFtcy5SZWFkU3RyZWFtXG4gICAgV3JpdGVTdHJlYW0gPSBsZWdTdHJlYW1zLldyaXRlU3RyZWFtXG4gIH1cblxuICB2YXIgZnMkUmVhZFN0cmVhbSA9IGZzLlJlYWRTdHJlYW1cbiAgaWYgKGZzJFJlYWRTdHJlYW0pIHtcbiAgICBSZWFkU3RyZWFtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoZnMkUmVhZFN0cmVhbS5wcm90b3R5cGUpXG4gICAgUmVhZFN0cmVhbS5wcm90b3R5cGUub3BlbiA9IFJlYWRTdHJlYW0kb3BlblxuICB9XG5cbiAgdmFyIGZzJFdyaXRlU3RyZWFtID0gZnMuV3JpdGVTdHJlYW1cbiAgaWYgKGZzJFdyaXRlU3RyZWFtKSB7XG4gICAgV3JpdGVTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShmcyRXcml0ZVN0cmVhbS5wcm90b3R5cGUpXG4gICAgV3JpdGVTdHJlYW0ucHJvdG90eXBlLm9wZW4gPSBXcml0ZVN0cmVhbSRvcGVuXG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnMsICdSZWFkU3RyZWFtJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFJlYWRTdHJlYW1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgUmVhZFN0cmVhbSA9IHZhbFxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZzLCAnV3JpdGVTdHJlYW0nLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gV3JpdGVTdHJlYW1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgV3JpdGVTdHJlYW0gPSB2YWxcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG5cbiAgLy8gbGVnYWN5IG5hbWVzXG4gIHZhciBGaWxlUmVhZFN0cmVhbSA9IFJlYWRTdHJlYW1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZzLCAnRmlsZVJlYWRTdHJlYW0nLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gRmlsZVJlYWRTdHJlYW1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgRmlsZVJlYWRTdHJlYW0gPSB2YWxcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG4gIHZhciBGaWxlV3JpdGVTdHJlYW0gPSBXcml0ZVN0cmVhbVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnMsICdGaWxlV3JpdGVTdHJlYW0nLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gRmlsZVdyaXRlU3RyZWFtXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIEZpbGVXcml0ZVN0cmVhbSA9IHZhbFxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcblxuICBmdW5jdGlvbiBSZWFkU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBSZWFkU3RyZWFtKVxuICAgICAgcmV0dXJuIGZzJFJlYWRTdHJlYW0uYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdGhpc1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBSZWFkU3RyZWFtLmFwcGx5KE9iamVjdC5jcmVhdGUoUmVhZFN0cmVhbS5wcm90b3R5cGUpLCBhcmd1bWVudHMpXG4gIH1cblxuICBmdW5jdGlvbiBSZWFkU3RyZWFtJG9wZW4gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIG9wZW4odGhhdC5wYXRoLCB0aGF0LmZsYWdzLCB0aGF0Lm1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGlmICh0aGF0LmF1dG9DbG9zZSlcbiAgICAgICAgICB0aGF0LmRlc3Ryb3koKVxuXG4gICAgICAgIHRoYXQuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0LmZkID0gZmRcbiAgICAgICAgdGhhdC5lbWl0KCdvcGVuJywgZmQpXG4gICAgICAgIHRoYXQucmVhZCgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIFdyaXRlU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBXcml0ZVN0cmVhbSlcbiAgICAgIHJldHVybiBmcyRXcml0ZVN0cmVhbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0aGlzXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFdyaXRlU3RyZWFtLmFwcGx5KE9iamVjdC5jcmVhdGUoV3JpdGVTdHJlYW0ucHJvdG90eXBlKSwgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gV3JpdGVTdHJlYW0kb3BlbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgb3Blbih0aGF0LnBhdGgsIHRoYXQuZmxhZ3MsIHRoYXQubW9kZSwgZnVuY3Rpb24gKGVyciwgZmQpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhhdC5kZXN0cm95KClcbiAgICAgICAgdGhhdC5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQuZmQgPSBmZFxuICAgICAgICB0aGF0LmVtaXQoJ29wZW4nLCBmZClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUmVhZFN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgZnMuUmVhZFN0cmVhbShwYXRoLCBvcHRpb25zKVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlV3JpdGVTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IGZzLldyaXRlU3RyZWFtKHBhdGgsIG9wdGlvbnMpXG4gIH1cblxuICB2YXIgZnMkb3BlbiA9IGZzLm9wZW5cbiAgZnMub3BlbiA9IG9wZW5cbiAgZnVuY3Rpb24gb3BlbiAocGF0aCwgZmxhZ3MsIG1vZGUsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBtb2RlID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBtb2RlLCBtb2RlID0gbnVsbFxuXG4gICAgcmV0dXJuIGdvJG9wZW4ocGF0aCwgZmxhZ3MsIG1vZGUsIGNiKVxuXG4gICAgZnVuY3Rpb24gZ28kb3BlbiAocGF0aCwgZmxhZ3MsIG1vZGUsIGNiLCBzdGFydFRpbWUpIHtcbiAgICAgIHJldHVybiBmcyRvcGVuKHBhdGgsIGZsYWdzLCBtb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyRvcGVuLCBbcGF0aCwgZmxhZ3MsIG1vZGUsIGNiXSwgZXJyLCBzdGFydFRpbWUgfHwgRGF0ZS5ub3coKSwgRGF0ZS5ub3coKV0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZzXG59XG5cbmZ1bmN0aW9uIGVucXVldWUgKGVsZW0pIHtcbiAgZGVidWcoJ0VOUVVFVUUnLCBlbGVtWzBdLm5hbWUsIGVsZW1bMV0pXG4gIGZzW2dyYWNlZnVsUXVldWVdLnB1c2goZWxlbSlcbiAgcmV0cnkoKVxufVxuXG4vLyBrZWVwIHRyYWNrIG9mIHRoZSB0aW1lb3V0IGJldHdlZW4gcmV0cnkoKSBjYWxsc1xudmFyIHJldHJ5VGltZXJcblxuLy8gcmVzZXQgdGhlIHN0YXJ0VGltZSBhbmQgbGFzdFRpbWUgdG8gbm93XG4vLyB0aGlzIHJlc2V0cyB0aGUgc3RhcnQgb2YgdGhlIDYwIHNlY29uZCBvdmVyYWxsIHRpbWVvdXQgYXMgd2VsbCBhcyB0aGVcbi8vIGRlbGF5IGJldHdlZW4gYXR0ZW1wdHMgc28gdGhhdCB3ZSdsbCByZXRyeSB0aGVzZSBqb2JzIHNvb25lclxuZnVuY3Rpb24gcmVzZXRRdWV1ZSAoKSB7XG4gIHZhciBub3cgPSBEYXRlLm5vdygpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZnNbZ3JhY2VmdWxRdWV1ZV0ubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBlbnRyaWVzIHRoYXQgYXJlIG9ubHkgYSBsZW5ndGggb2YgMiBhcmUgZnJvbSBhbiBvbGRlciB2ZXJzaW9uLCBkb24ndFxuICAgIC8vIGJvdGhlciBtb2RpZnlpbmcgdGhvc2Ugc2luY2UgdGhleSdsbCBiZSByZXRyaWVkIGFueXdheS5cbiAgICBpZiAoZnNbZ3JhY2VmdWxRdWV1ZV1baV0ubGVuZ3RoID4gMikge1xuICAgICAgZnNbZ3JhY2VmdWxRdWV1ZV1baV1bM10gPSBub3cgLy8gc3RhcnRUaW1lXG4gICAgICBmc1tncmFjZWZ1bFF1ZXVlXVtpXVs0XSA9IG5vdyAvLyBsYXN0VGltZVxuICAgIH1cbiAgfVxuICAvLyBjYWxsIHJldHJ5IHRvIG1ha2Ugc3VyZSB3ZSdyZSBhY3RpdmVseSBwcm9jZXNzaW5nIHRoZSBxdWV1ZVxuICByZXRyeSgpXG59XG5cbmZ1bmN0aW9uIHJldHJ5ICgpIHtcbiAgLy8gY2xlYXIgdGhlIHRpbWVyIGFuZCByZW1vdmUgaXQgdG8gaGVscCBwcmV2ZW50IHVuaW50ZW5kZWQgY29uY3VycmVuY3lcbiAgY2xlYXJUaW1lb3V0KHJldHJ5VGltZXIpXG4gIHJldHJ5VGltZXIgPSB1bmRlZmluZWRcblxuICBpZiAoZnNbZ3JhY2VmdWxRdWV1ZV0ubGVuZ3RoID09PSAwKVxuICAgIHJldHVyblxuXG4gIHZhciBlbGVtID0gZnNbZ3JhY2VmdWxRdWV1ZV0uc2hpZnQoKVxuICB2YXIgZm4gPSBlbGVtWzBdXG4gIHZhciBhcmdzID0gZWxlbVsxXVxuICAvLyB0aGVzZSBpdGVtcyBtYXkgYmUgdW5zZXQgaWYgdGhleSB3ZXJlIGFkZGVkIGJ5IGFuIG9sZGVyIGdyYWNlZnVsLWZzXG4gIHZhciBlcnIgPSBlbGVtWzJdXG4gIHZhciBzdGFydFRpbWUgPSBlbGVtWzNdXG4gIHZhciBsYXN0VGltZSA9IGVsZW1bNF1cblxuICAvLyBpZiB3ZSBkb24ndCBoYXZlIGEgc3RhcnRUaW1lIHdlIGhhdmUgbm8gd2F5IG9mIGtub3dpbmcgaWYgd2UndmUgd2FpdGVkXG4gIC8vIGxvbmcgZW5vdWdoLCBzbyBnbyBhaGVhZCBhbmQgcmV0cnkgdGhpcyBpdGVtIG5vd1xuICBpZiAoc3RhcnRUaW1lID09PSB1bmRlZmluZWQpIHtcbiAgICBkZWJ1ZygnUkVUUlknLCBmbi5uYW1lLCBhcmdzKVxuICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH0gZWxzZSBpZiAoRGF0ZS5ub3coKSAtIHN0YXJ0VGltZSA+PSA2MDAwMCkge1xuICAgIC8vIGl0J3MgYmVlbiBtb3JlIHRoYW4gNjAgc2Vjb25kcyB0b3RhbCwgYmFpbCBub3dcbiAgICBkZWJ1ZygnVElNRU9VVCcsIGZuLm5hbWUsIGFyZ3MpXG4gICAgdmFyIGNiID0gYXJncy5wb3AoKVxuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICBjYi5jYWxsKG51bGwsIGVycilcbiAgfSBlbHNlIHtcbiAgICAvLyB0aGUgYW1vdW50IG9mIHRpbWUgYmV0d2VlbiB0aGUgbGFzdCBhdHRlbXB0IGFuZCByaWdodCBub3dcbiAgICB2YXIgc2luY2VBdHRlbXB0ID0gRGF0ZS5ub3coKSAtIGxhc3RUaW1lXG4gICAgLy8gdGhlIGFtb3VudCBvZiB0aW1lIGJldHdlZW4gd2hlbiB3ZSBmaXJzdCB0cmllZCwgYW5kIHdoZW4gd2UgbGFzdCB0cmllZFxuICAgIC8vIHJvdW5kZWQgdXAgdG8gYXQgbGVhc3QgMVxuICAgIHZhciBzaW5jZVN0YXJ0ID0gTWF0aC5tYXgobGFzdFRpbWUgLSBzdGFydFRpbWUsIDEpXG4gICAgLy8gYmFja29mZi4gd2FpdCBsb25nZXIgdGhhbiB0aGUgdG90YWwgdGltZSB3ZSd2ZSBiZWVuIHJldHJ5aW5nLCBidXQgb25seVxuICAgIC8vIHVwIHRvIGEgbWF4aW11bSBvZiAxMDBtc1xuICAgIHZhciBkZXNpcmVkRGVsYXkgPSBNYXRoLm1pbihzaW5jZVN0YXJ0ICogMS4yLCAxMDApXG4gICAgLy8gaXQncyBiZWVuIGxvbmcgZW5vdWdoIHNpbmNlIHRoZSBsYXN0IHJldHJ5LCBkbyBpdCBhZ2FpblxuICAgIGlmIChzaW5jZUF0dGVtcHQgPj0gZGVzaXJlZERlbGF5KSB7XG4gICAgICBkZWJ1ZygnUkVUUlknLCBmbi5uYW1lLCBhcmdzKVxuICAgICAgZm4uYXBwbHkobnVsbCwgYXJncy5jb25jYXQoW3N0YXJ0VGltZV0pKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiB3ZSBjYW4ndCBkbyB0aGlzIGpvYiB5ZXQsIHB1c2ggaXQgdG8gdGhlIGVuZCBvZiB0aGUgcXVldWVcbiAgICAgIC8vIGFuZCBsZXQgdGhlIG5leHQgaXRlcmF0aW9uIGNoZWNrIGFnYWluXG4gICAgICBmc1tncmFjZWZ1bFF1ZXVlXS5wdXNoKGVsZW0pXG4gICAgfVxuICB9XG5cbiAgLy8gc2NoZWR1bGUgb3VyIG5leHQgcnVuIGlmIG9uZSBpc24ndCBhbHJlYWR5IHNjaGVkdWxlZFxuICBpZiAocmV0cnlUaW1lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0cnlUaW1lciA9IHNldFRpbWVvdXQocmV0cnksIDApXG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCdcbi8vIFRoaXMgaXMgYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9ub3JtYWxpemUvbXpcbi8vIENvcHlyaWdodCAoYykgMjAxNC0yMDE2IEpvbmF0aGFuIE9uZyBtZUBqb25nbGViZXJyeS5jb20gYW5kIENvbnRyaWJ1dG9yc1xuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5cbmNvbnN0IGFwaSA9IFtcbiAgJ2FjY2VzcycsXG4gICdhcHBlbmRGaWxlJyxcbiAgJ2NobW9kJyxcbiAgJ2Nob3duJyxcbiAgJ2Nsb3NlJyxcbiAgJ2NvcHlGaWxlJyxcbiAgJ2ZjaG1vZCcsXG4gICdmY2hvd24nLFxuICAnZmRhdGFzeW5jJyxcbiAgJ2ZzdGF0JyxcbiAgJ2ZzeW5jJyxcbiAgJ2Z0cnVuY2F0ZScsXG4gICdmdXRpbWVzJyxcbiAgJ2xjaG1vZCcsXG4gICdsY2hvd24nLFxuICAnbGluaycsXG4gICdsc3RhdCcsXG4gICdta2RpcicsXG4gICdta2R0ZW1wJyxcbiAgJ29wZW4nLFxuICAnb3BlbmRpcicsXG4gICdyZWFkZGlyJyxcbiAgJ3JlYWRGaWxlJyxcbiAgJ3JlYWRsaW5rJyxcbiAgJ3JlYWxwYXRoJyxcbiAgJ3JlbmFtZScsXG4gICdybScsXG4gICdybWRpcicsXG4gICdzdGF0JyxcbiAgJ3N5bWxpbmsnLFxuICAndHJ1bmNhdGUnLFxuICAndW5saW5rJyxcbiAgJ3V0aW1lcycsXG4gICd3cml0ZUZpbGUnXG5dLmZpbHRlcihrZXkgPT4ge1xuICAvLyBTb21lIGNvbW1hbmRzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHNvbWUgc3lzdGVtcy4gRXg6XG4gIC8vIGZzLmNwIHdhcyBhZGRlZCBpbiBOb2RlLmpzIHYxNi43LjBcbiAgLy8gZnMubGNob3duIGlzIG5vdCBhdmFpbGFibGUgb24gYXQgbGVhc3Qgc29tZSBMaW51eFxuICByZXR1cm4gdHlwZW9mIGZzW2tleV0gPT09ICdmdW5jdGlvbidcbn0pXG5cbi8vIEV4cG9ydCBjbG9uZWQgZnM6XG5PYmplY3QuYXNzaWduKGV4cG9ydHMsIGZzKVxuXG4vLyBVbml2ZXJzYWxpZnkgYXN5bmMgbWV0aG9kczpcbmFwaS5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gIGV4cG9ydHNbbWV0aG9kXSA9IHUoZnNbbWV0aG9kXSlcbn0pXG5cbi8vIFdlIGRpZmZlciBmcm9tIG16L2ZzIGluIHRoYXQgd2Ugc3RpbGwgc2hpcCB0aGUgb2xkLCBicm9rZW4sIGZzLmV4aXN0cygpXG4vLyBzaW5jZSB3ZSBhcmUgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciB0aGUgbmF0aXZlIG1vZHVsZVxuZXhwb3J0cy5leGlzdHMgPSBmdW5jdGlvbiAoZmlsZW5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZnMuZXhpc3RzKGZpbGVuYW1lLCBjYWxsYmFjaylcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgcmV0dXJuIGZzLmV4aXN0cyhmaWxlbmFtZSwgcmVzb2x2ZSlcbiAgfSlcbn1cblxuLy8gZnMucmVhZCgpLCBmcy53cml0ZSgpLCBmcy5yZWFkdigpLCAmIGZzLndyaXRldigpIG5lZWQgc3BlY2lhbCB0cmVhdG1lbnQgZHVlIHRvIG11bHRpcGxlIGNhbGxiYWNrIGFyZ3NcblxuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmcy5yZWFkKGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgY2FsbGJhY2spXG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmcy5yZWFkKGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgKGVyciwgYnl0ZXNSZWFkLCBidWZmZXIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgcmVzb2x2ZSh7IGJ5dGVzUmVhZCwgYnVmZmVyIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuLy8gRnVuY3Rpb24gc2lnbmF0dXJlIGNhbiBiZVxuLy8gZnMud3JpdGUoZmQsIGJ1ZmZlclssIG9mZnNldFssIGxlbmd0aFssIHBvc2l0aW9uXV1dLCBjYWxsYmFjaylcbi8vIE9SXG4vLyBmcy53cml0ZShmZCwgc3RyaW5nWywgcG9zaXRpb25bLCBlbmNvZGluZ11dLCBjYWxsYmFjaylcbi8vIFdlIG5lZWQgdG8gaGFuZGxlIGJvdGggY2FzZXMsIHNvIHdlIHVzZSAuLi5hcmdzXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGZkLCBidWZmZXIsIC4uLmFyZ3MpIHtcbiAgaWYgKHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZnMud3JpdGUoZmQsIGJ1ZmZlciwgLi4uYXJncylcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZnMud3JpdGUoZmQsIGJ1ZmZlciwgLi4uYXJncywgKGVyciwgYnl0ZXNXcml0dGVuLCBidWZmZXIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgcmVzb2x2ZSh7IGJ5dGVzV3JpdHRlbiwgYnVmZmVyIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuLy8gRnVuY3Rpb24gc2lnbmF0dXJlIGlzXG4vLyBzLnJlYWR2KGZkLCBidWZmZXJzWywgcG9zaXRpb25dLCBjYWxsYmFjaylcbi8vIFdlIG5lZWQgdG8gaGFuZGxlIHRoZSBvcHRpb25hbCBhcmcsIHNvIHdlIHVzZSAuLi5hcmdzXG5leHBvcnRzLnJlYWR2ID0gZnVuY3Rpb24gKGZkLCBidWZmZXJzLCAuLi5hcmdzKSB7XG4gIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZzLnJlYWR2KGZkLCBidWZmZXJzLCAuLi5hcmdzKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmcy5yZWFkdihmZCwgYnVmZmVycywgLi4uYXJncywgKGVyciwgYnl0ZXNSZWFkLCBidWZmZXJzKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIHJlc29sdmUoeyBieXRlc1JlYWQsIGJ1ZmZlcnMgfSlcbiAgICB9KVxuICB9KVxufVxuXG4vLyBGdW5jdGlvbiBzaWduYXR1cmUgaXNcbi8vIHMud3JpdGV2KGZkLCBidWZmZXJzWywgcG9zaXRpb25dLCBjYWxsYmFjaylcbi8vIFdlIG5lZWQgdG8gaGFuZGxlIHRoZSBvcHRpb25hbCBhcmcsIHNvIHdlIHVzZSAuLi5hcmdzXG5leHBvcnRzLndyaXRldiA9IGZ1bmN0aW9uIChmZCwgYnVmZmVycywgLi4uYXJncykge1xuICBpZiAodHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmcy53cml0ZXYoZmQsIGJ1ZmZlcnMsIC4uLmFyZ3MpXG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZzLndyaXRldihmZCwgYnVmZmVycywgLi4uYXJncywgKGVyciwgYnl0ZXNXcml0dGVuLCBidWZmZXJzKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIHJlc29sdmUoeyBieXRlc1dyaXR0ZW4sIGJ1ZmZlcnMgfSlcbiAgICB9KVxuICB9KVxufVxuXG4vLyBmcy5yZWFscGF0aC5uYXRpdmUgc29tZXRpbWVzIG5vdCBhdmFpbGFibGUgaWYgZnMgaXMgbW9ua2V5LXBhdGNoZWRcbmlmICh0eXBlb2YgZnMucmVhbHBhdGgubmF0aXZlID09PSAnZnVuY3Rpb24nKSB7XG4gIGV4cG9ydHMucmVhbHBhdGgubmF0aXZlID0gdShmcy5yZWFscGF0aC5uYXRpdmUpXG59IGVsc2Uge1xuICBwcm9jZXNzLmVtaXRXYXJuaW5nKFxuICAgICdmcy5yZWFscGF0aC5uYXRpdmUgaXMgbm90IGEgZnVuY3Rpb24uIElzIGZzIGJlaW5nIG1vbmtleS1wYXRjaGVkPycsXG4gICAgJ1dhcm5pbmcnLCAnZnMtZXh0cmEtV0FSTjAwMDMnXG4gIClcbn1cbiIsICIvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9tYWtlLWRpclxuLy8gQ29weXJpZ2h0IChjKSBTaW5kcmUgU29yaHVzIDxzaW5kcmVzb3JodXNAZ21haWwuY29tPiAoc2luZHJlc29yaHVzLmNvbSlcbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuJ3VzZSBzdHJpY3QnXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvODk4N1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2xpYnV2L2xpYnV2L3B1bGwvMTA4OFxubW9kdWxlLmV4cG9ydHMuY2hlY2tQYXRoID0gZnVuY3Rpb24gY2hlY2tQYXRoIChwdGgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICBjb25zdCBwYXRoSGFzSW52YWxpZFdpbkNoYXJhY3RlcnMgPSAvWzw+OlwifD8qXS8udGVzdChwdGgucmVwbGFjZShwYXRoLnBhcnNlKHB0aCkucm9vdCwgJycpKVxuXG4gICAgaWYgKHBhdGhIYXNJbnZhbGlkV2luQ2hhcmFjdGVycykge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYFBhdGggY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzOiAke3B0aH1gKVxuICAgICAgZXJyb3IuY29kZSA9ICdFSU5WQUwnXG4gICAgICB0aHJvdyBlcnJvclxuICAgIH1cbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuY29uc3QgZnMgPSByZXF1aXJlKCcuLi9mcycpXG5jb25zdCB7IGNoZWNrUGF0aCB9ID0gcmVxdWlyZSgnLi91dGlscycpXG5cbmNvbnN0IGdldE1vZGUgPSBvcHRpb25zID0+IHtcbiAgY29uc3QgZGVmYXVsdHMgPSB7IG1vZGU6IDBvNzc3IH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJykgcmV0dXJuIG9wdGlvbnNcbiAgcmV0dXJuICh7IC4uLmRlZmF1bHRzLCAuLi5vcHRpb25zIH0pLm1vZGVcbn1cblxubW9kdWxlLmV4cG9ydHMubWFrZURpciA9IGFzeW5jIChkaXIsIG9wdGlvbnMpID0+IHtcbiAgY2hlY2tQYXRoKGRpcilcblxuICByZXR1cm4gZnMubWtkaXIoZGlyLCB7XG4gICAgbW9kZTogZ2V0TW9kZShvcHRpb25zKSxcbiAgICByZWN1cnNpdmU6IHRydWVcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMubWFrZURpclN5bmMgPSAoZGlyLCBvcHRpb25zKSA9PiB7XG4gIGNoZWNrUGF0aChkaXIpXG5cbiAgcmV0dXJuIGZzLm1rZGlyU3luYyhkaXIsIHtcbiAgICBtb2RlOiBnZXRNb2RlKG9wdGlvbnMpLFxuICAgIHJlY3Vyc2l2ZTogdHJ1ZVxuICB9KVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5jb25zdCB7IG1ha2VEaXI6IF9tYWtlRGlyLCBtYWtlRGlyU3luYyB9ID0gcmVxdWlyZSgnLi9tYWtlLWRpcicpXG5jb25zdCBtYWtlRGlyID0gdShfbWFrZURpcilcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1rZGlyczogbWFrZURpcixcbiAgbWtkaXJzU3luYzogbWFrZURpclN5bmMsXG4gIC8vIGFsaWFzXG4gIG1rZGlycDogbWFrZURpcixcbiAgbWtkaXJwU3luYzogbWFrZURpclN5bmMsXG4gIGVuc3VyZURpcjogbWFrZURpcixcbiAgZW5zdXJlRGlyU3luYzogbWFrZURpclN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tUHJvbWlzZVxuY29uc3QgZnMgPSByZXF1aXJlKCcuLi9mcycpXG5cbmZ1bmN0aW9uIHBhdGhFeGlzdHMgKHBhdGgpIHtcbiAgcmV0dXJuIGZzLmFjY2VzcyhwYXRoKS50aGVuKCgpID0+IHRydWUpLmNhdGNoKCgpID0+IGZhbHNlKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGF0aEV4aXN0czogdShwYXRoRXhpc3RzKSxcbiAgcGF0aEV4aXN0c1N5bmM6IGZzLmV4aXN0c1N5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCcuLi9mcycpXG5jb25zdCB1ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JykuZnJvbVByb21pc2VcblxuYXN5bmMgZnVuY3Rpb24gdXRpbWVzTWlsbGlzIChwYXRoLCBhdGltZSwgbXRpbWUpIHtcbiAgLy8gaWYgKCFIQVNfTUlMTElTX1JFUykgcmV0dXJuIGZzLnV0aW1lcyhwYXRoLCBhdGltZSwgbXRpbWUsIGNhbGxiYWNrKVxuICBjb25zdCBmZCA9IGF3YWl0IGZzLm9wZW4ocGF0aCwgJ3IrJylcblxuICBsZXQgY2xvc2VFcnIgPSBudWxsXG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBmcy5mdXRpbWVzKGZkLCBhdGltZSwgbXRpbWUpXG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZzLmNsb3NlKGZkKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNsb3NlRXJyID0gZVxuICAgIH1cbiAgfVxuXG4gIGlmIChjbG9zZUVycikge1xuICAgIHRocm93IGNsb3NlRXJyXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRpbWVzTWlsbGlzU3luYyAocGF0aCwgYXRpbWUsIG10aW1lKSB7XG4gIGNvbnN0IGZkID0gZnMub3BlblN5bmMocGF0aCwgJ3IrJylcbiAgZnMuZnV0aW1lc1N5bmMoZmQsIGF0aW1lLCBtdGltZSlcbiAgcmV0dXJuIGZzLmNsb3NlU3luYyhmZClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHV0aW1lc01pbGxpczogdSh1dGltZXNNaWxsaXMpLFxuICB1dGltZXNNaWxsaXNTeW5jXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnLi4vZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5cbmZ1bmN0aW9uIGdldFN0YXRzIChzcmMsIGRlc3QsIG9wdHMpIHtcbiAgY29uc3Qgc3RhdEZ1bmMgPSBvcHRzLmRlcmVmZXJlbmNlXG4gICAgPyAoZmlsZSkgPT4gZnMuc3RhdChmaWxlLCB7IGJpZ2ludDogdHJ1ZSB9KVxuICAgIDogKGZpbGUpID0+IGZzLmxzdGF0KGZpbGUsIHsgYmlnaW50OiB0cnVlIH0pXG4gIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgc3RhdEZ1bmMoc3JjKSxcbiAgICBzdGF0RnVuYyhkZXN0KS5jYXRjaChlcnIgPT4ge1xuICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuIG51bGxcbiAgICAgIHRocm93IGVyclxuICAgIH0pXG4gIF0pLnRoZW4oKFtzcmNTdGF0LCBkZXN0U3RhdF0pID0+ICh7IHNyY1N0YXQsIGRlc3RTdGF0IH0pKVxufVxuXG5mdW5jdGlvbiBnZXRTdGF0c1N5bmMgKHNyYywgZGVzdCwgb3B0cykge1xuICBsZXQgZGVzdFN0YXRcbiAgY29uc3Qgc3RhdEZ1bmMgPSBvcHRzLmRlcmVmZXJlbmNlXG4gICAgPyAoZmlsZSkgPT4gZnMuc3RhdFN5bmMoZmlsZSwgeyBiaWdpbnQ6IHRydWUgfSlcbiAgICA6IChmaWxlKSA9PiBmcy5sc3RhdFN5bmMoZmlsZSwgeyBiaWdpbnQ6IHRydWUgfSlcbiAgY29uc3Qgc3JjU3RhdCA9IHN0YXRGdW5jKHNyYylcbiAgdHJ5IHtcbiAgICBkZXN0U3RhdCA9IHN0YXRGdW5jKGRlc3QpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHJldHVybiB7IHNyY1N0YXQsIGRlc3RTdGF0OiBudWxsIH1cbiAgICB0aHJvdyBlcnJcbiAgfVxuICByZXR1cm4geyBzcmNTdGF0LCBkZXN0U3RhdCB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoZWNrUGF0aHMgKHNyYywgZGVzdCwgZnVuY05hbWUsIG9wdHMpIHtcbiAgY29uc3QgeyBzcmNTdGF0LCBkZXN0U3RhdCB9ID0gYXdhaXQgZ2V0U3RhdHMoc3JjLCBkZXN0LCBvcHRzKVxuICBpZiAoZGVzdFN0YXQpIHtcbiAgICBpZiAoYXJlSWRlbnRpY2FsKHNyY1N0YXQsIGRlc3RTdGF0KSkge1xuICAgICAgY29uc3Qgc3JjQmFzZU5hbWUgPSBwYXRoLmJhc2VuYW1lKHNyYylcbiAgICAgIGNvbnN0IGRlc3RCYXNlTmFtZSA9IHBhdGguYmFzZW5hbWUoZGVzdClcbiAgICAgIGlmIChmdW5jTmFtZSA9PT0gJ21vdmUnICYmXG4gICAgICAgIHNyY0Jhc2VOYW1lICE9PSBkZXN0QmFzZU5hbWUgJiZcbiAgICAgICAgc3JjQmFzZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gZGVzdEJhc2VOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgcmV0dXJuIHsgc3JjU3RhdCwgZGVzdFN0YXQsIGlzQ2hhbmdpbmdDYXNlOiB0cnVlIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIGFuZCBkZXN0aW5hdGlvbiBtdXN0IG5vdCBiZSB0aGUgc2FtZS4nKVxuICAgIH1cbiAgICBpZiAoc3JjU3RhdC5pc0RpcmVjdG9yeSgpICYmICFkZXN0U3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgbm9uLWRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBkaXJlY3RvcnkgJyR7c3JjfScuYClcbiAgICB9XG4gICAgaWYgKCFzcmNTdGF0LmlzRGlyZWN0b3J5KCkgJiYgZGVzdFN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgb3ZlcndyaXRlIGRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBub24tZGlyZWN0b3J5ICcke3NyY30nLmApXG4gICAgfVxuICB9XG5cbiAgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkoKSAmJiBpc1NyY1N1YmRpcihzcmMsIGRlc3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyhzcmMsIGRlc3QsIGZ1bmNOYW1lKSlcbiAgfVxuXG4gIHJldHVybiB7IHNyY1N0YXQsIGRlc3RTdGF0IH1cbn1cblxuZnVuY3Rpb24gY2hlY2tQYXRoc1N5bmMgKHNyYywgZGVzdCwgZnVuY05hbWUsIG9wdHMpIHtcbiAgY29uc3QgeyBzcmNTdGF0LCBkZXN0U3RhdCB9ID0gZ2V0U3RhdHNTeW5jKHNyYywgZGVzdCwgb3B0cylcblxuICBpZiAoZGVzdFN0YXQpIHtcbiAgICBpZiAoYXJlSWRlbnRpY2FsKHNyY1N0YXQsIGRlc3RTdGF0KSkge1xuICAgICAgY29uc3Qgc3JjQmFzZU5hbWUgPSBwYXRoLmJhc2VuYW1lKHNyYylcbiAgICAgIGNvbnN0IGRlc3RCYXNlTmFtZSA9IHBhdGguYmFzZW5hbWUoZGVzdClcbiAgICAgIGlmIChmdW5jTmFtZSA9PT0gJ21vdmUnICYmXG4gICAgICAgIHNyY0Jhc2VOYW1lICE9PSBkZXN0QmFzZU5hbWUgJiZcbiAgICAgICAgc3JjQmFzZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gZGVzdEJhc2VOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgcmV0dXJuIHsgc3JjU3RhdCwgZGVzdFN0YXQsIGlzQ2hhbmdpbmdDYXNlOiB0cnVlIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIGFuZCBkZXN0aW5hdGlvbiBtdXN0IG5vdCBiZSB0aGUgc2FtZS4nKVxuICAgIH1cbiAgICBpZiAoc3JjU3RhdC5pc0RpcmVjdG9yeSgpICYmICFkZXN0U3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgbm9uLWRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBkaXJlY3RvcnkgJyR7c3JjfScuYClcbiAgICB9XG4gICAgaWYgKCFzcmNTdGF0LmlzRGlyZWN0b3J5KCkgJiYgZGVzdFN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgb3ZlcndyaXRlIGRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBub24tZGlyZWN0b3J5ICcke3NyY30nLmApXG4gICAgfVxuICB9XG5cbiAgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkoKSAmJiBpc1NyY1N1YmRpcihzcmMsIGRlc3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyhzcmMsIGRlc3QsIGZ1bmNOYW1lKSlcbiAgfVxuICByZXR1cm4geyBzcmNTdGF0LCBkZXN0U3RhdCB9XG59XG5cbi8vIHJlY3Vyc2l2ZWx5IGNoZWNrIGlmIGRlc3QgcGFyZW50IGlzIGEgc3ViZGlyZWN0b3J5IG9mIHNyYy5cbi8vIEl0IHdvcmtzIGZvciBhbGwgZmlsZSB0eXBlcyBpbmNsdWRpbmcgc3ltbGlua3Mgc2luY2UgaXRcbi8vIGNoZWNrcyB0aGUgc3JjIGFuZCBkZXN0IGlub2Rlcy4gSXQgc3RhcnRzIGZyb20gdGhlIGRlZXBlc3Rcbi8vIHBhcmVudCBhbmQgc3RvcHMgb25jZSBpdCByZWFjaGVzIHRoZSBzcmMgcGFyZW50IG9yIHRoZSByb290IHBhdGguXG5hc3luYyBmdW5jdGlvbiBjaGVja1BhcmVudFBhdGhzIChzcmMsIHNyY1N0YXQsIGRlc3QsIGZ1bmNOYW1lKSB7XG4gIGNvbnN0IHNyY1BhcmVudCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoc3JjKSlcbiAgY29uc3QgZGVzdFBhcmVudCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoZGVzdCkpXG4gIGlmIChkZXN0UGFyZW50ID09PSBzcmNQYXJlbnQgfHwgZGVzdFBhcmVudCA9PT0gcGF0aC5wYXJzZShkZXN0UGFyZW50KS5yb290KSByZXR1cm5cblxuICBsZXQgZGVzdFN0YXRcbiAgdHJ5IHtcbiAgICBkZXN0U3RhdCA9IGF3YWl0IGZzLnN0YXQoZGVzdFBhcmVudCwgeyBiaWdpbnQ6IHRydWUgfSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuXG4gICAgdGhyb3cgZXJyXG4gIH1cblxuICBpZiAoYXJlSWRlbnRpY2FsKHNyY1N0YXQsIGRlc3RTdGF0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2coc3JjLCBkZXN0LCBmdW5jTmFtZSkpXG4gIH1cblxuICByZXR1cm4gY2hlY2tQYXJlbnRQYXRocyhzcmMsIHNyY1N0YXQsIGRlc3RQYXJlbnQsIGZ1bmNOYW1lKVxufVxuXG5mdW5jdGlvbiBjaGVja1BhcmVudFBhdGhzU3luYyAoc3JjLCBzcmNTdGF0LCBkZXN0LCBmdW5jTmFtZSkge1xuICBjb25zdCBzcmNQYXJlbnQgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHNyYykpXG4gIGNvbnN0IGRlc3RQYXJlbnQgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGRlc3QpKVxuICBpZiAoZGVzdFBhcmVudCA9PT0gc3JjUGFyZW50IHx8IGRlc3RQYXJlbnQgPT09IHBhdGgucGFyc2UoZGVzdFBhcmVudCkucm9vdCkgcmV0dXJuXG4gIGxldCBkZXN0U3RhdFxuICB0cnkge1xuICAgIGRlc3RTdGF0ID0gZnMuc3RhdFN5bmMoZGVzdFBhcmVudCwgeyBiaWdpbnQ6IHRydWUgfSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuXG4gICAgdGhyb3cgZXJyXG4gIH1cbiAgaWYgKGFyZUlkZW50aWNhbChzcmNTdGF0LCBkZXN0U3RhdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKHNyYywgZGVzdCwgZnVuY05hbWUpKVxuICB9XG4gIHJldHVybiBjaGVja1BhcmVudFBhdGhzU3luYyhzcmMsIHNyY1N0YXQsIGRlc3RQYXJlbnQsIGZ1bmNOYW1lKVxufVxuXG5mdW5jdGlvbiBhcmVJZGVudGljYWwgKHNyY1N0YXQsIGRlc3RTdGF0KSB7XG4gIHJldHVybiBkZXN0U3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ICYmIGRlc3RTdGF0LmlubyA9PT0gc3JjU3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ID09PSBzcmNTdGF0LmRldlxufVxuXG4vLyByZXR1cm4gdHJ1ZSBpZiBkZXN0IGlzIGEgc3ViZGlyIG9mIHNyYywgb3RoZXJ3aXNlIGZhbHNlLlxuLy8gSXQgb25seSBjaGVja3MgdGhlIHBhdGggc3RyaW5ncy5cbmZ1bmN0aW9uIGlzU3JjU3ViZGlyIChzcmMsIGRlc3QpIHtcbiAgY29uc3Qgc3JjQXJyID0gcGF0aC5yZXNvbHZlKHNyYykuc3BsaXQocGF0aC5zZXApLmZpbHRlcihpID0+IGkpXG4gIGNvbnN0IGRlc3RBcnIgPSBwYXRoLnJlc29sdmUoZGVzdCkuc3BsaXQocGF0aC5zZXApLmZpbHRlcihpID0+IGkpXG4gIHJldHVybiBzcmNBcnIuZXZlcnkoKGN1ciwgaSkgPT4gZGVzdEFycltpXSA9PT0gY3VyKVxufVxuXG5mdW5jdGlvbiBlcnJNc2cgKHNyYywgZGVzdCwgZnVuY05hbWUpIHtcbiAgcmV0dXJuIGBDYW5ub3QgJHtmdW5jTmFtZX0gJyR7c3JjfScgdG8gYSBzdWJkaXJlY3Rvcnkgb2YgaXRzZWxmLCAnJHtkZXN0fScuYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gY2hlY2tQYXRoc1xuICBjaGVja1BhdGhzOiB1KGNoZWNrUGF0aHMpLFxuICBjaGVja1BhdGhzU3luYyxcbiAgLy8gY2hlY2tQYXJlbnRcbiAgY2hlY2tQYXJlbnRQYXRoczogdShjaGVja1BhcmVudFBhdGhzKSxcbiAgY2hlY2tQYXJlbnRQYXRoc1N5bmMsXG4gIC8vIE1pc2NcbiAgaXNTcmNTdWJkaXIsXG4gIGFyZUlkZW50aWNhbFxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJy4uL2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHsgbWtkaXJzIH0gPSByZXF1aXJlKCcuLi9ta2RpcnMnKVxuY29uc3QgeyBwYXRoRXhpc3RzIH0gPSByZXF1aXJlKCcuLi9wYXRoLWV4aXN0cycpXG5jb25zdCB7IHV0aW1lc01pbGxpcyB9ID0gcmVxdWlyZSgnLi4vdXRpbC91dGltZXMnKVxuY29uc3Qgc3RhdCA9IHJlcXVpcmUoJy4uL3V0aWwvc3RhdCcpXG5cbmFzeW5jIGZ1bmN0aW9uIGNvcHkgKHNyYywgZGVzdCwgb3B0cyA9IHt9KSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdHMgPSB7IGZpbHRlcjogb3B0cyB9XG4gIH1cblxuICBvcHRzLmNsb2JiZXIgPSAnY2xvYmJlcicgaW4gb3B0cyA/ICEhb3B0cy5jbG9iYmVyIDogdHJ1ZSAvLyBkZWZhdWx0IHRvIHRydWUgZm9yIG5vd1xuICBvcHRzLm92ZXJ3cml0ZSA9ICdvdmVyd3JpdGUnIGluIG9wdHMgPyAhIW9wdHMub3ZlcndyaXRlIDogb3B0cy5jbG9iYmVyIC8vIG92ZXJ3cml0ZSBmYWxscyBiYWNrIHRvIGNsb2JiZXJcblxuICAvLyBXYXJuIGFib3V0IHVzaW5nIHByZXNlcnZlVGltZXN0YW1wcyBvbiAzMi1iaXQgbm9kZVxuICBpZiAob3B0cy5wcmVzZXJ2ZVRpbWVzdGFtcHMgJiYgcHJvY2Vzcy5hcmNoID09PSAnaWEzMicpIHtcbiAgICBwcm9jZXNzLmVtaXRXYXJuaW5nKFxuICAgICAgJ1VzaW5nIHRoZSBwcmVzZXJ2ZVRpbWVzdGFtcHMgb3B0aW9uIGluIDMyLWJpdCBub2RlIGlzIG5vdCByZWNvbW1lbmRlZDtcXG5cXG4nICtcbiAgICAgICdcXHRzZWUgaHR0cHM6Ly9naXRodWIuY29tL2pwcmljaGFyZHNvbi9ub2RlLWZzLWV4dHJhL2lzc3Vlcy8yNjknLFxuICAgICAgJ1dhcm5pbmcnLCAnZnMtZXh0cmEtV0FSTjAwMDEnXG4gICAgKVxuICB9XG5cbiAgY29uc3QgeyBzcmNTdGF0LCBkZXN0U3RhdCB9ID0gYXdhaXQgc3RhdC5jaGVja1BhdGhzKHNyYywgZGVzdCwgJ2NvcHknLCBvcHRzKVxuXG4gIGF3YWl0IHN0YXQuY2hlY2tQYXJlbnRQYXRocyhzcmMsIHNyY1N0YXQsIGRlc3QsICdjb3B5JylcblxuICBjb25zdCBpbmNsdWRlID0gYXdhaXQgcnVuRmlsdGVyKHNyYywgZGVzdCwgb3B0cylcblxuICBpZiAoIWluY2x1ZGUpIHJldHVyblxuXG4gIC8vIGNoZWNrIGlmIHRoZSBwYXJlbnQgb2YgZGVzdCBleGlzdHMsIGFuZCBjcmVhdGUgaXQgaWYgaXQgZG9lc24ndCBleGlzdFxuICBjb25zdCBkZXN0UGFyZW50ID0gcGF0aC5kaXJuYW1lKGRlc3QpXG4gIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IHBhdGhFeGlzdHMoZGVzdFBhcmVudClcbiAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICBhd2FpdCBta2RpcnMoZGVzdFBhcmVudClcbiAgfVxuXG4gIGF3YWl0IGdldFN0YXRzQW5kUGVyZm9ybUNvcHkoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuRmlsdGVyIChzcmMsIGRlc3QsIG9wdHMpIHtcbiAgaWYgKCFvcHRzLmZpbHRlcikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIG9wdHMuZmlsdGVyKHNyYywgZGVzdClcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U3RhdHNBbmRQZXJmb3JtQ29weSAoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBjb25zdCBzdGF0Rm4gPSBvcHRzLmRlcmVmZXJlbmNlID8gZnMuc3RhdCA6IGZzLmxzdGF0XG4gIGNvbnN0IHNyY1N0YXQgPSBhd2FpdCBzdGF0Rm4oc3JjKVxuXG4gIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5KCkpIHJldHVybiBvbkRpcihzcmNTdGF0LCBkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxuXG4gIGlmIChcbiAgICBzcmNTdGF0LmlzRmlsZSgpIHx8XG4gICAgc3JjU3RhdC5pc0NoYXJhY3RlckRldmljZSgpIHx8XG4gICAgc3JjU3RhdC5pc0Jsb2NrRGV2aWNlKClcbiAgKSByZXR1cm4gb25GaWxlKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG5cbiAgaWYgKHNyY1N0YXQuaXNTeW1ib2xpY0xpbmsoKSkgcmV0dXJuIG9uTGluayhkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxuICBpZiAoc3JjU3RhdC5pc1NvY2tldCgpKSB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjb3B5IGEgc29ja2V0IGZpbGU6ICR7c3JjfWApXG4gIGlmIChzcmNTdGF0LmlzRklGTygpKSB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjb3B5IGEgRklGTyBwaXBlOiAke3NyY31gKVxuICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZmlsZTogJHtzcmN9YClcbn1cblxuYXN5bmMgZnVuY3Rpb24gb25GaWxlIChzcmNTdGF0LCBkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBjb3B5RmlsZShzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG5cbiAgaWYgKG9wdHMub3ZlcndyaXRlKSB7XG4gICAgYXdhaXQgZnMudW5saW5rKGRlc3QpXG4gICAgcmV0dXJuIGNvcHlGaWxlKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cylcbiAgfVxuICBpZiAob3B0cy5lcnJvck9uRXhpc3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2Rlc3R9JyBhbHJlYWR5IGV4aXN0c2ApXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY29weUZpbGUgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBhd2FpdCBmcy5jb3B5RmlsZShzcmMsIGRlc3QpXG4gIGlmIChvcHRzLnByZXNlcnZlVGltZXN0YW1wcykge1xuICAgIC8vIE1ha2Ugc3VyZSB0aGUgZmlsZSBpcyB3cml0YWJsZSBiZWZvcmUgc2V0dGluZyB0aGUgdGltZXN0YW1wXG4gICAgLy8gb3RoZXJ3aXNlIG9wZW4gZmFpbHMgd2l0aCBFUEVSTSB3aGVuIGludm9rZWQgd2l0aCAncisnXG4gICAgLy8gKHRocm91Z2ggdXRpbWVzIGNhbGwpXG4gICAgaWYgKGZpbGVJc05vdFdyaXRhYmxlKHNyY1N0YXQubW9kZSkpIHtcbiAgICAgIGF3YWl0IG1ha2VGaWxlV3JpdGFibGUoZGVzdCwgc3JjU3RhdC5tb2RlKVxuICAgIH1cblxuICAgIC8vIFNldCB0aW1lc3RhbXBzIGFuZCBtb2RlIGNvcnJlc3BvbmRpbmdseVxuXG4gICAgLy8gTm90ZSB0aGF0IFRoZSBpbml0aWFsIHNyY1N0YXQuYXRpbWUgY2Fubm90IGJlIHRydXN0ZWRcbiAgICAvLyBiZWNhdXNlIGl0IGlzIG1vZGlmaWVkIGJ5IHRoZSByZWFkKDIpIHN5c3RlbSBjYWxsXG4gICAgLy8gKFNlZSBodHRwczovL25vZGVqcy5vcmcvYXBpL2ZzLmh0bWwjZnNfc3RhdF90aW1lX3ZhbHVlcylcbiAgICBjb25zdCB1cGRhdGVkU3JjU3RhdCA9IGF3YWl0IGZzLnN0YXQoc3JjKVxuICAgIGF3YWl0IHV0aW1lc01pbGxpcyhkZXN0LCB1cGRhdGVkU3JjU3RhdC5hdGltZSwgdXBkYXRlZFNyY1N0YXQubXRpbWUpXG4gIH1cblxuICByZXR1cm4gZnMuY2htb2QoZGVzdCwgc3JjU3RhdC5tb2RlKVxufVxuXG5mdW5jdGlvbiBmaWxlSXNOb3RXcml0YWJsZSAoc3JjTW9kZSkge1xuICByZXR1cm4gKHNyY01vZGUgJiAwbzIwMCkgPT09IDBcbn1cblxuZnVuY3Rpb24gbWFrZUZpbGVXcml0YWJsZSAoZGVzdCwgc3JjTW9kZSkge1xuICByZXR1cm4gZnMuY2htb2QoZGVzdCwgc3JjTW9kZSB8IDBvMjAwKVxufVxuXG5hc3luYyBmdW5jdGlvbiBvbkRpciAoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICAvLyB0aGUgZGVzdCBkaXJlY3RvcnkgbWlnaHQgbm90IGV4aXN0LCBjcmVhdGUgaXRcbiAgaWYgKCFkZXN0U3RhdCkge1xuICAgIGF3YWl0IGZzLm1rZGlyKGRlc3QpXG4gIH1cblxuICBjb25zdCBpdGVtcyA9IGF3YWl0IGZzLnJlYWRkaXIoc3JjKVxuXG4gIC8vIGxvb3AgdGhyb3VnaCB0aGUgZmlsZXMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IHRvIGNvcHkgZXZlcnl0aGluZ1xuICBhd2FpdCBQcm9taXNlLmFsbChpdGVtcy5tYXAoYXN5bmMgaXRlbSA9PiB7XG4gICAgY29uc3Qgc3JjSXRlbSA9IHBhdGguam9pbihzcmMsIGl0ZW0pXG4gICAgY29uc3QgZGVzdEl0ZW0gPSBwYXRoLmpvaW4oZGVzdCwgaXRlbSlcblxuICAgIC8vIHNraXAgdGhlIGl0ZW0gaWYgaXQgaXMgbWF0Y2hlcyBieSB0aGUgZmlsdGVyIGZ1bmN0aW9uXG4gICAgY29uc3QgaW5jbHVkZSA9IGF3YWl0IHJ1bkZpbHRlcihzcmNJdGVtLCBkZXN0SXRlbSwgb3B0cylcbiAgICBpZiAoIWluY2x1ZGUpIHJldHVyblxuXG4gICAgY29uc3QgeyBkZXN0U3RhdCB9ID0gYXdhaXQgc3RhdC5jaGVja1BhdGhzKHNyY0l0ZW0sIGRlc3RJdGVtLCAnY29weScsIG9wdHMpXG5cbiAgICAvLyBJZiB0aGUgaXRlbSBpcyBhIGNvcHlhYmxlIGZpbGUsIGBnZXRTdGF0c0FuZFBlcmZvcm1Db3B5YCB3aWxsIGNvcHkgaXRcbiAgICAvLyBJZiB0aGUgaXRlbSBpcyBhIGRpcmVjdG9yeSwgYGdldFN0YXRzQW5kUGVyZm9ybUNvcHlgIHdpbGwgY2FsbCBgb25EaXJgIHJlY3Vyc2l2ZWx5XG4gICAgcmV0dXJuIGdldFN0YXRzQW5kUGVyZm9ybUNvcHkoZGVzdFN0YXQsIHNyY0l0ZW0sIGRlc3RJdGVtLCBvcHRzKVxuICB9KSlcblxuICBpZiAoIWRlc3RTdGF0KSB7XG4gICAgYXdhaXQgZnMuY2htb2QoZGVzdCwgc3JjU3RhdC5tb2RlKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uTGluayAoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBsZXQgcmVzb2x2ZWRTcmMgPSBhd2FpdCBmcy5yZWFkbGluayhzcmMpXG4gIGlmIChvcHRzLmRlcmVmZXJlbmNlKSB7XG4gICAgcmVzb2x2ZWRTcmMgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgcmVzb2x2ZWRTcmMpXG4gIH1cbiAgaWYgKCFkZXN0U3RhdCkge1xuICAgIHJldHVybiBmcy5zeW1saW5rKHJlc29sdmVkU3JjLCBkZXN0KVxuICB9XG5cbiAgbGV0IHJlc29sdmVkRGVzdCA9IG51bGxcbiAgdHJ5IHtcbiAgICByZXNvbHZlZERlc3QgPSBhd2FpdCBmcy5yZWFkbGluayhkZXN0KVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gZGVzdCBleGlzdHMgYW5kIGlzIGEgcmVndWxhciBmaWxlIG9yIGRpcmVjdG9yeSxcbiAgICAvLyBXaW5kb3dzIG1heSB0aHJvdyBVTktOT1dOIGVycm9yLiBJZiBkZXN0IGFscmVhZHkgZXhpc3RzLFxuICAgIC8vIGZzIHRocm93cyBlcnJvciBhbnl3YXksIHNvIG5vIG5lZWQgdG8gZ3VhcmQgYWdhaW5zdCBpdCBoZXJlLlxuICAgIGlmIChlLmNvZGUgPT09ICdFSU5WQUwnIHx8IGUuY29kZSA9PT0gJ1VOS05PV04nKSByZXR1cm4gZnMuc3ltbGluayhyZXNvbHZlZFNyYywgZGVzdClcbiAgICB0aHJvdyBlXG4gIH1cbiAgaWYgKG9wdHMuZGVyZWZlcmVuY2UpIHtcbiAgICByZXNvbHZlZERlc3QgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgcmVzb2x2ZWREZXN0KVxuICB9XG4gIGlmIChzdGF0LmlzU3JjU3ViZGlyKHJlc29sdmVkU3JjLCByZXNvbHZlZERlc3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY29weSAnJHtyZXNvbHZlZFNyY30nIHRvIGEgc3ViZGlyZWN0b3J5IG9mIGl0c2VsZiwgJyR7cmVzb2x2ZWREZXN0fScuYClcbiAgfVxuXG4gIC8vIGRvIG5vdCBjb3B5IGlmIHNyYyBpcyBhIHN1YmRpciBvZiBkZXN0IHNpbmNlIHVubGlua2luZ1xuICAvLyBkZXN0IGluIHRoaXMgY2FzZSB3b3VsZCByZXN1bHQgaW4gcmVtb3Zpbmcgc3JjIGNvbnRlbnRzXG4gIC8vIGFuZCB0aGVyZWZvcmUgYSBicm9rZW4gc3ltbGluayB3b3VsZCBiZSBjcmVhdGVkLlxuICBpZiAoc3RhdC5pc1NyY1N1YmRpcihyZXNvbHZlZERlc3QsIHJlc29sdmVkU3JjKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IG92ZXJ3cml0ZSAnJHtyZXNvbHZlZERlc3R9JyB3aXRoICcke3Jlc29sdmVkU3JjfScuYClcbiAgfVxuXG4gIC8vIGNvcHkgdGhlIGxpbmtcbiAgYXdhaXQgZnMudW5saW5rKGRlc3QpXG4gIHJldHVybiBmcy5zeW1saW5rKHJlc29sdmVkU3JjLCBkZXN0KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlcbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBta2RpcnNTeW5jID0gcmVxdWlyZSgnLi4vbWtkaXJzJykubWtkaXJzU3luY1xuY29uc3QgdXRpbWVzTWlsbGlzU3luYyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbWVzJykudXRpbWVzTWlsbGlzU3luY1xuY29uc3Qgc3RhdCA9IHJlcXVpcmUoJy4uL3V0aWwvc3RhdCcpXG5cbmZ1bmN0aW9uIGNvcHlTeW5jIChzcmMsIGRlc3QsIG9wdHMpIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0cyA9IHsgZmlsdGVyOiBvcHRzIH1cbiAgfVxuXG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIG9wdHMuY2xvYmJlciA9ICdjbG9iYmVyJyBpbiBvcHRzID8gISFvcHRzLmNsb2JiZXIgOiB0cnVlIC8vIGRlZmF1bHQgdG8gdHJ1ZSBmb3Igbm93XG4gIG9wdHMub3ZlcndyaXRlID0gJ292ZXJ3cml0ZScgaW4gb3B0cyA/ICEhb3B0cy5vdmVyd3JpdGUgOiBvcHRzLmNsb2JiZXIgLy8gb3ZlcndyaXRlIGZhbGxzIGJhY2sgdG8gY2xvYmJlclxuXG4gIC8vIFdhcm4gYWJvdXQgdXNpbmcgcHJlc2VydmVUaW1lc3RhbXBzIG9uIDMyLWJpdCBub2RlXG4gIGlmIChvcHRzLnByZXNlcnZlVGltZXN0YW1wcyAmJiBwcm9jZXNzLmFyY2ggPT09ICdpYTMyJykge1xuICAgIHByb2Nlc3MuZW1pdFdhcm5pbmcoXG4gICAgICAnVXNpbmcgdGhlIHByZXNlcnZlVGltZXN0YW1wcyBvcHRpb24gaW4gMzItYml0IG5vZGUgaXMgbm90IHJlY29tbWVuZGVkO1xcblxcbicgK1xuICAgICAgJ1xcdHNlZSBodHRwczovL2dpdGh1Yi5jb20vanByaWNoYXJkc29uL25vZGUtZnMtZXh0cmEvaXNzdWVzLzI2OScsXG4gICAgICAnV2FybmluZycsICdmcy1leHRyYS1XQVJOMDAwMidcbiAgICApXG4gIH1cblxuICBjb25zdCB7IHNyY1N0YXQsIGRlc3RTdGF0IH0gPSBzdGF0LmNoZWNrUGF0aHNTeW5jKHNyYywgZGVzdCwgJ2NvcHknLCBvcHRzKVxuICBzdGF0LmNoZWNrUGFyZW50UGF0aHNTeW5jKHNyYywgc3JjU3RhdCwgZGVzdCwgJ2NvcHknKVxuICBpZiAob3B0cy5maWx0ZXIgJiYgIW9wdHMuZmlsdGVyKHNyYywgZGVzdCkpIHJldHVyblxuICBjb25zdCBkZXN0UGFyZW50ID0gcGF0aC5kaXJuYW1lKGRlc3QpXG4gIGlmICghZnMuZXhpc3RzU3luYyhkZXN0UGFyZW50KSkgbWtkaXJzU3luYyhkZXN0UGFyZW50KVxuICByZXR1cm4gZ2V0U3RhdHMoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbn1cblxuZnVuY3Rpb24gZ2V0U3RhdHMgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgY29uc3Qgc3RhdFN5bmMgPSBvcHRzLmRlcmVmZXJlbmNlID8gZnMuc3RhdFN5bmMgOiBmcy5sc3RhdFN5bmNcbiAgY29uc3Qgc3JjU3RhdCA9IHN0YXRTeW5jKHNyYylcblxuICBpZiAoc3JjU3RhdC5pc0RpcmVjdG9yeSgpKSByZXR1cm4gb25EaXIoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbiAgZWxzZSBpZiAoc3JjU3RhdC5pc0ZpbGUoKSB8fFxuICAgICAgICAgICBzcmNTdGF0LmlzQ2hhcmFjdGVyRGV2aWNlKCkgfHxcbiAgICAgICAgICAgc3JjU3RhdC5pc0Jsb2NrRGV2aWNlKCkpIHJldHVybiBvbkZpbGUoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbiAgZWxzZSBpZiAoc3JjU3RhdC5pc1N5bWJvbGljTGluaygpKSByZXR1cm4gb25MaW5rKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG4gIGVsc2UgaWYgKHNyY1N0YXQuaXNTb2NrZXQoKSkgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY29weSBhIHNvY2tldCBmaWxlOiAke3NyY31gKVxuICBlbHNlIGlmIChzcmNTdGF0LmlzRklGTygpKSB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjb3B5IGEgRklGTyBwaXBlOiAke3NyY31gKVxuICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZmlsZTogJHtzcmN9YClcbn1cblxuZnVuY3Rpb24gb25GaWxlIChzcmNTdGF0LCBkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBjb3B5RmlsZShzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG4gIHJldHVybiBtYXlDb3B5RmlsZShzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG59XG5cbmZ1bmN0aW9uIG1heUNvcHlGaWxlIChzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgaWYgKG9wdHMub3ZlcndyaXRlKSB7XG4gICAgZnMudW5saW5rU3luYyhkZXN0KVxuICAgIHJldHVybiBjb3B5RmlsZShzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG4gIH0gZWxzZSBpZiAob3B0cy5lcnJvck9uRXhpc3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2Rlc3R9JyBhbHJlYWR5IGV4aXN0c2ApXG4gIH1cbn1cblxuZnVuY3Rpb24gY29weUZpbGUgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBmcy5jb3B5RmlsZVN5bmMoc3JjLCBkZXN0KVxuICBpZiAob3B0cy5wcmVzZXJ2ZVRpbWVzdGFtcHMpIGhhbmRsZVRpbWVzdGFtcHMoc3JjU3RhdC5tb2RlLCBzcmMsIGRlc3QpXG4gIHJldHVybiBzZXREZXN0TW9kZShkZXN0LCBzcmNTdGF0Lm1vZGUpXG59XG5cbmZ1bmN0aW9uIGhhbmRsZVRpbWVzdGFtcHMgKHNyY01vZGUsIHNyYywgZGVzdCkge1xuICAvLyBNYWtlIHN1cmUgdGhlIGZpbGUgaXMgd3JpdGFibGUgYmVmb3JlIHNldHRpbmcgdGhlIHRpbWVzdGFtcFxuICAvLyBvdGhlcndpc2Ugb3BlbiBmYWlscyB3aXRoIEVQRVJNIHdoZW4gaW52b2tlZCB3aXRoICdyKydcbiAgLy8gKHRocm91Z2ggdXRpbWVzIGNhbGwpXG4gIGlmIChmaWxlSXNOb3RXcml0YWJsZShzcmNNb2RlKSkgbWFrZUZpbGVXcml0YWJsZShkZXN0LCBzcmNNb2RlKVxuICByZXR1cm4gc2V0RGVzdFRpbWVzdGFtcHMoc3JjLCBkZXN0KVxufVxuXG5mdW5jdGlvbiBmaWxlSXNOb3RXcml0YWJsZSAoc3JjTW9kZSkge1xuICByZXR1cm4gKHNyY01vZGUgJiAwbzIwMCkgPT09IDBcbn1cblxuZnVuY3Rpb24gbWFrZUZpbGVXcml0YWJsZSAoZGVzdCwgc3JjTW9kZSkge1xuICByZXR1cm4gc2V0RGVzdE1vZGUoZGVzdCwgc3JjTW9kZSB8IDBvMjAwKVxufVxuXG5mdW5jdGlvbiBzZXREZXN0TW9kZSAoZGVzdCwgc3JjTW9kZSkge1xuICByZXR1cm4gZnMuY2htb2RTeW5jKGRlc3QsIHNyY01vZGUpXG59XG5cbmZ1bmN0aW9uIHNldERlc3RUaW1lc3RhbXBzIChzcmMsIGRlc3QpIHtcbiAgLy8gVGhlIGluaXRpYWwgc3JjU3RhdC5hdGltZSBjYW5ub3QgYmUgdHJ1c3RlZFxuICAvLyBiZWNhdXNlIGl0IGlzIG1vZGlmaWVkIGJ5IHRoZSByZWFkKDIpIHN5c3RlbSBjYWxsXG4gIC8vIChTZWUgaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9mcy5odG1sI2ZzX3N0YXRfdGltZV92YWx1ZXMpXG4gIGNvbnN0IHVwZGF0ZWRTcmNTdGF0ID0gZnMuc3RhdFN5bmMoc3JjKVxuICByZXR1cm4gdXRpbWVzTWlsbGlzU3luYyhkZXN0LCB1cGRhdGVkU3JjU3RhdC5hdGltZSwgdXBkYXRlZFNyY1N0YXQubXRpbWUpXG59XG5cbmZ1bmN0aW9uIG9uRGlyIChzcmNTdGF0LCBkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBta0RpckFuZENvcHkoc3JjU3RhdC5tb2RlLCBzcmMsIGRlc3QsIG9wdHMpXG4gIHJldHVybiBjb3B5RGlyKHNyYywgZGVzdCwgb3B0cylcbn1cblxuZnVuY3Rpb24gbWtEaXJBbmRDb3B5IChzcmNNb2RlLCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgZnMubWtkaXJTeW5jKGRlc3QpXG4gIGNvcHlEaXIoc3JjLCBkZXN0LCBvcHRzKVxuICByZXR1cm4gc2V0RGVzdE1vZGUoZGVzdCwgc3JjTW9kZSlcbn1cblxuZnVuY3Rpb24gY29weURpciAoc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGZzLnJlYWRkaXJTeW5jKHNyYykuZm9yRWFjaChpdGVtID0+IGNvcHlEaXJJdGVtKGl0ZW0sIHNyYywgZGVzdCwgb3B0cykpXG59XG5cbmZ1bmN0aW9uIGNvcHlEaXJJdGVtIChpdGVtLCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgY29uc3Qgc3JjSXRlbSA9IHBhdGguam9pbihzcmMsIGl0ZW0pXG4gIGNvbnN0IGRlc3RJdGVtID0gcGF0aC5qb2luKGRlc3QsIGl0ZW0pXG4gIGlmIChvcHRzLmZpbHRlciAmJiAhb3B0cy5maWx0ZXIoc3JjSXRlbSwgZGVzdEl0ZW0pKSByZXR1cm5cbiAgY29uc3QgeyBkZXN0U3RhdCB9ID0gc3RhdC5jaGVja1BhdGhzU3luYyhzcmNJdGVtLCBkZXN0SXRlbSwgJ2NvcHknLCBvcHRzKVxuICByZXR1cm4gZ2V0U3RhdHMoZGVzdFN0YXQsIHNyY0l0ZW0sIGRlc3RJdGVtLCBvcHRzKVxufVxuXG5mdW5jdGlvbiBvbkxpbmsgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgbGV0IHJlc29sdmVkU3JjID0gZnMucmVhZGxpbmtTeW5jKHNyYylcbiAgaWYgKG9wdHMuZGVyZWZlcmVuY2UpIHtcbiAgICByZXNvbHZlZFNyYyA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCByZXNvbHZlZFNyYylcbiAgfVxuXG4gIGlmICghZGVzdFN0YXQpIHtcbiAgICByZXR1cm4gZnMuc3ltbGlua1N5bmMocmVzb2x2ZWRTcmMsIGRlc3QpXG4gIH0gZWxzZSB7XG4gICAgbGV0IHJlc29sdmVkRGVzdFxuICAgIHRyeSB7XG4gICAgICByZXNvbHZlZERlc3QgPSBmcy5yZWFkbGlua1N5bmMoZGVzdClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIGRlc3QgZXhpc3RzIGFuZCBpcyBhIHJlZ3VsYXIgZmlsZSBvciBkaXJlY3RvcnksXG4gICAgICAvLyBXaW5kb3dzIG1heSB0aHJvdyBVTktOT1dOIGVycm9yLiBJZiBkZXN0IGFscmVhZHkgZXhpc3RzLFxuICAgICAgLy8gZnMgdGhyb3dzIGVycm9yIGFueXdheSwgc28gbm8gbmVlZCB0byBndWFyZCBhZ2FpbnN0IGl0IGhlcmUuXG4gICAgICBpZiAoZXJyLmNvZGUgPT09ICdFSU5WQUwnIHx8IGVyci5jb2RlID09PSAnVU5LTk9XTicpIHJldHVybiBmcy5zeW1saW5rU3luYyhyZXNvbHZlZFNyYywgZGVzdClcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgICBpZiAob3B0cy5kZXJlZmVyZW5jZSkge1xuICAgICAgcmVzb2x2ZWREZXN0ID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHJlc29sdmVkRGVzdClcbiAgICB9XG4gICAgaWYgKHN0YXQuaXNTcmNTdWJkaXIocmVzb2x2ZWRTcmMsIHJlc29sdmVkRGVzdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNvcHkgJyR7cmVzb2x2ZWRTcmN9JyB0byBhIHN1YmRpcmVjdG9yeSBvZiBpdHNlbGYsICcke3Jlc29sdmVkRGVzdH0nLmApXG4gICAgfVxuXG4gICAgLy8gcHJldmVudCBjb3B5IGlmIHNyYyBpcyBhIHN1YmRpciBvZiBkZXN0IHNpbmNlIHVubGlua2luZ1xuICAgIC8vIGRlc3QgaW4gdGhpcyBjYXNlIHdvdWxkIHJlc3VsdCBpbiByZW1vdmluZyBzcmMgY29udGVudHNcbiAgICAvLyBhbmQgdGhlcmVmb3JlIGEgYnJva2VuIHN5bWxpbmsgd291bGQgYmUgY3JlYXRlZC5cbiAgICBpZiAoc3RhdC5pc1NyY1N1YmRpcihyZXNvbHZlZERlc3QsIHJlc29sdmVkU3JjKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgb3ZlcndyaXRlICcke3Jlc29sdmVkRGVzdH0nIHdpdGggJyR7cmVzb2x2ZWRTcmN9Jy5gKVxuICAgIH1cbiAgICByZXR1cm4gY29weUxpbmsocmVzb2x2ZWRTcmMsIGRlc3QpXG4gIH1cbn1cblxuZnVuY3Rpb24gY29weUxpbmsgKHJlc29sdmVkU3JjLCBkZXN0KSB7XG4gIGZzLnVubGlua1N5bmMoZGVzdClcbiAgcmV0dXJuIGZzLnN5bWxpbmtTeW5jKHJlc29sdmVkU3JjLCBkZXN0KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW5jXG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tUHJvbWlzZVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvcHk6IHUocmVxdWlyZSgnLi9jb3B5JykpLFxuICBjb3B5U3luYzogcmVxdWlyZSgnLi9jb3B5LXN5bmMnKVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcblxuZnVuY3Rpb24gcmVtb3ZlIChwYXRoLCBjYWxsYmFjaykge1xuICBmcy5ybShwYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSwgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN5bmMgKHBhdGgpIHtcbiAgZnMucm1TeW5jKHBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVtb3ZlOiB1KHJlbW92ZSksXG4gIHJlbW92ZVN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5jb25zdCBmcyA9IHJlcXVpcmUoJy4uL2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IHJlbW92ZSA9IHJlcXVpcmUoJy4uL3JlbW92ZScpXG5cbmNvbnN0IGVtcHR5RGlyID0gdShhc3luYyBmdW5jdGlvbiBlbXB0eURpciAoZGlyKSB7XG4gIGxldCBpdGVtc1xuICB0cnkge1xuICAgIGl0ZW1zID0gYXdhaXQgZnMucmVhZGRpcihkaXIpXG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBta2Rpci5ta2RpcnMoZGlyKVxuICB9XG5cbiAgcmV0dXJuIFByb21pc2UuYWxsKGl0ZW1zLm1hcChpdGVtID0+IHJlbW92ZS5yZW1vdmUocGF0aC5qb2luKGRpciwgaXRlbSkpKSlcbn0pXG5cbmZ1bmN0aW9uIGVtcHR5RGlyU3luYyAoZGlyKSB7XG4gIGxldCBpdGVtc1xuICB0cnkge1xuICAgIGl0ZW1zID0gZnMucmVhZGRpclN5bmMoZGlyKVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbWtkaXIubWtkaXJzU3luYyhkaXIpXG4gIH1cblxuICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0gPSBwYXRoLmpvaW4oZGlyLCBpdGVtKVxuICAgIHJlbW92ZS5yZW1vdmVTeW5jKGl0ZW0pXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbXB0eURpclN5bmMsXG4gIGVtcHR5ZGlyU3luYzogZW1wdHlEaXJTeW5jLFxuICBlbXB0eURpcixcbiAgZW1wdHlkaXI6IGVtcHR5RGlyXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tUHJvbWlzZVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCcuLi9mcycpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUZpbGUgKGZpbGUpIHtcbiAgbGV0IHN0YXRzXG4gIHRyeSB7XG4gICAgc3RhdHMgPSBhd2FpdCBmcy5zdGF0KGZpbGUpXG4gIH0gY2F0Y2ggeyB9XG4gIGlmIChzdGF0cyAmJiBzdGF0cy5pc0ZpbGUoKSkgcmV0dXJuXG5cbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG5cbiAgbGV0IGRpclN0YXRzID0gbnVsbFxuICB0cnkge1xuICAgIGRpclN0YXRzID0gYXdhaXQgZnMuc3RhdChkaXIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIGlmIHRoZSBkaXJlY3RvcnkgZG9lc24ndCBleGlzdCwgbWFrZSBpdFxuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIGF3YWl0IG1rZGlyLm1rZGlycyhkaXIpXG4gICAgICBhd2FpdCBmcy53cml0ZUZpbGUoZmlsZSwgJycpXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuICB9XG5cbiAgaWYgKGRpclN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUoZmlsZSwgJycpXG4gIH0gZWxzZSB7XG4gICAgLy8gcGFyZW50IGlzIG5vdCBhIGRpcmVjdG9yeVxuICAgIC8vIFRoaXMgaXMganVzdCB0byBjYXVzZSBhbiBpbnRlcm5hbCBFTk9URElSIGVycm9yIHRvIGJlIHRocm93blxuICAgIGF3YWl0IGZzLnJlYWRkaXIoZGlyKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbGVTeW5jIChmaWxlKSB7XG4gIGxldCBzdGF0c1xuICB0cnkge1xuICAgIHN0YXRzID0gZnMuc3RhdFN5bmMoZmlsZSlcbiAgfSBjYXRjaCB7IH1cbiAgaWYgKHN0YXRzICYmIHN0YXRzLmlzRmlsZSgpKSByZXR1cm5cblxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSlcbiAgdHJ5IHtcbiAgICBpZiAoIWZzLnN0YXRTeW5jKGRpcikuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgLy8gcGFyZW50IGlzIG5vdCBhIGRpcmVjdG9yeVxuICAgICAgLy8gVGhpcyBpcyBqdXN0IHRvIGNhdXNlIGFuIGludGVybmFsIEVOT1RESVIgZXJyb3IgdG8gYmUgdGhyb3duXG4gICAgICBmcy5yZWFkZGlyU3luYyhkaXIpXG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBJZiB0aGUgc3RhdCBjYWxsIGFib3ZlIGZhaWxlZCBiZWNhdXNlIHRoZSBkaXJlY3RvcnkgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gICAgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIG1rZGlyLm1rZGlyc1N5bmMoZGlyKVxuICAgIGVsc2UgdGhyb3cgZXJyXG4gIH1cblxuICBmcy53cml0ZUZpbGVTeW5jKGZpbGUsICcnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlRmlsZTogdShjcmVhdGVGaWxlKSxcbiAgY3JlYXRlRmlsZVN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJy4uL2ZzJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IHsgcGF0aEV4aXN0cyB9ID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKVxuY29uc3QgeyBhcmVJZGVudGljYWwgfSA9IHJlcXVpcmUoJy4uL3V0aWwvc3RhdCcpXG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxpbmsgKHNyY3BhdGgsIGRzdHBhdGgpIHtcbiAgbGV0IGRzdFN0YXRcbiAgdHJ5IHtcbiAgICBkc3RTdGF0ID0gYXdhaXQgZnMubHN0YXQoZHN0cGF0aClcbiAgfSBjYXRjaCB7XG4gICAgLy8gaWdub3JlIGVycm9yXG4gIH1cblxuICBsZXQgc3JjU3RhdFxuICB0cnkge1xuICAgIHNyY1N0YXQgPSBhd2FpdCBmcy5sc3RhdChzcmNwYXRoKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlLnJlcGxhY2UoJ2xzdGF0JywgJ2Vuc3VyZUxpbmsnKVxuICAgIHRocm93IGVyclxuICB9XG5cbiAgaWYgKGRzdFN0YXQgJiYgYXJlSWRlbnRpY2FsKHNyY1N0YXQsIGRzdFN0YXQpKSByZXR1cm5cblxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcblxuICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCBwYXRoRXhpc3RzKGRpcilcblxuICBpZiAoIWRpckV4aXN0cykge1xuICAgIGF3YWl0IG1rZGlyLm1rZGlycyhkaXIpXG4gIH1cblxuICBhd2FpdCBmcy5saW5rKHNyY3BhdGgsIGRzdHBhdGgpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtTeW5jIChzcmNwYXRoLCBkc3RwYXRoKSB7XG4gIGxldCBkc3RTdGF0XG4gIHRyeSB7XG4gICAgZHN0U3RhdCA9IGZzLmxzdGF0U3luYyhkc3RwYXRoKVxuICB9IGNhdGNoIHt9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBzcmNTdGF0ID0gZnMubHN0YXRTeW5jKHNyY3BhdGgpXG4gICAgaWYgKGRzdFN0YXQgJiYgYXJlSWRlbnRpY2FsKHNyY1N0YXQsIGRzdFN0YXQpKSByZXR1cm5cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZS5yZXBsYWNlKCdsc3RhdCcsICdlbnN1cmVMaW5rJylcbiAgICB0aHJvdyBlcnJcbiAgfVxuXG4gIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShkc3RwYXRoKVxuICBjb25zdCBkaXJFeGlzdHMgPSBmcy5leGlzdHNTeW5jKGRpcilcbiAgaWYgKGRpckV4aXN0cykgcmV0dXJuIGZzLmxpbmtTeW5jKHNyY3BhdGgsIGRzdHBhdGgpXG4gIG1rZGlyLm1rZGlyc1N5bmMoZGlyKVxuXG4gIHJldHVybiBmcy5saW5rU3luYyhzcmNwYXRoLCBkc3RwYXRoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlTGluazogdShjcmVhdGVMaW5rKSxcbiAgY3JlYXRlTGlua1N5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCcuLi9mcycpXG5jb25zdCB7IHBhdGhFeGlzdHMgfSA9IHJlcXVpcmUoJy4uL3BhdGgtZXhpc3RzJylcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHR3byB0eXBlcyBvZiBwYXRocywgb25lIHJlbGF0aXZlIHRvIHN5bWxpbmssIGFuZCBvbmVcbiAqIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LiBDaGVja3MgaWYgcGF0aCBpcyBhYnNvbHV0ZSBvclxuICogcmVsYXRpdmUuIElmIHRoZSBwYXRoIGlzIHJlbGF0aXZlLCB0aGlzIGZ1bmN0aW9uIGNoZWNrcyBpZiB0aGUgcGF0aCBpc1xuICogcmVsYXRpdmUgdG8gc3ltbGluayBvciByZWxhdGl2ZSB0byBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LiBUaGlzIGlzIGFuXG4gKiBpbml0aWF0aXZlIHRvIGZpbmQgYSBzbWFydGVyIGBzcmNwYXRoYCB0byBzdXBwbHkgd2hlbiBidWlsZGluZyBzeW1saW5rcy5cbiAqIFRoaXMgYWxsb3dzIHlvdSB0byBkZXRlcm1pbmUgd2hpY2ggcGF0aCB0byB1c2Ugb3V0IG9mIG9uZSBvZiB0aHJlZSBwb3NzaWJsZVxuICogdHlwZXMgb2Ygc291cmNlIHBhdGhzLiBUaGUgZmlyc3QgaXMgYW4gYWJzb2x1dGUgcGF0aC4gVGhpcyBpcyBkZXRlY3RlZCBieVxuICogYHBhdGguaXNBYnNvbHV0ZSgpYC4gV2hlbiBhbiBhYnNvbHV0ZSBwYXRoIGlzIHByb3ZpZGVkLCBpdCBpcyBjaGVja2VkIHRvXG4gKiBzZWUgaWYgaXQgZXhpc3RzLiBJZiBpdCBkb2VzIGl0J3MgdXNlZCwgaWYgbm90IGFuIGVycm9yIGlzIHJldHVybmVkXG4gKiAoY2FsbGJhY2spLyB0aHJvd24gKHN5bmMpLiBUaGUgb3RoZXIgdHdvIG9wdGlvbnMgZm9yIGBzcmNwYXRoYCBhcmUgYVxuICogcmVsYXRpdmUgdXJsLiBCeSBkZWZhdWx0IE5vZGUncyBgZnMuc3ltbGlua2Agd29ya3MgYnkgY3JlYXRpbmcgYSBzeW1saW5rXG4gKiB1c2luZyBgZHN0cGF0aGAgYW5kIGV4cGVjdHMgdGhlIGBzcmNwYXRoYCB0byBiZSByZWxhdGl2ZSB0byB0aGUgbmV3bHlcbiAqIGNyZWF0ZWQgc3ltbGluay4gSWYgeW91IHByb3ZpZGUgYSBgc3JjcGF0aGAgdGhhdCBkb2VzIG5vdCBleGlzdCBvbiB0aGUgZmlsZVxuICogc3lzdGVtIGl0IHJlc3VsdHMgaW4gYSBicm9rZW4gc3ltbGluay4gVG8gbWluaW1pemUgdGhpcywgdGhlIGZ1bmN0aW9uXG4gKiBjaGVja3MgdG8gc2VlIGlmIHRoZSAncmVsYXRpdmUgdG8gc3ltbGluaycgc291cmNlIGZpbGUgZXhpc3RzLCBhbmQgaWYgaXRcbiAqIGRvZXMgaXQgd2lsbCB1c2UgaXQuIElmIGl0IGRvZXMgbm90LCBpdCBjaGVja3MgaWYgdGhlcmUncyBhIGZpbGUgdGhhdFxuICogZXhpc3RzIHRoYXQgaXMgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnksIGlmIGRvZXMgaXRzIHVzZWQuXG4gKiBUaGlzIHByZXNlcnZlcyB0aGUgZXhwZWN0YXRpb25zIG9mIHRoZSBvcmlnaW5hbCBmcy5zeW1saW5rIHNwZWMgYW5kIGFkZHNcbiAqIHRoZSBhYmlsaXR5IHRvIHBhc3MgaW4gYHJlbGF0aXZlIHRvIGN1cnJlbnQgd29ya2luZyBkaXJlY290cnlgIHBhdGhzLlxuICovXG5cbmFzeW5jIGZ1bmN0aW9uIHN5bWxpbmtQYXRocyAoc3JjcGF0aCwgZHN0cGF0aCkge1xuICBpZiAocGF0aC5pc0Fic29sdXRlKHNyY3BhdGgpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZzLmxzdGF0KHNyY3BhdGgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBlcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlLnJlcGxhY2UoJ2xzdGF0JywgJ2Vuc3VyZVN5bWxpbmsnKVxuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvQ3dkOiBzcmNwYXRoLFxuICAgICAgdG9Ec3Q6IHNyY3BhdGhcbiAgICB9XG4gIH1cblxuICBjb25zdCBkc3RkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgY29uc3QgcmVsYXRpdmVUb0RzdCA9IHBhdGguam9pbihkc3RkaXIsIHNyY3BhdGgpXG5cbiAgY29uc3QgZXhpc3RzID0gYXdhaXQgcGF0aEV4aXN0cyhyZWxhdGl2ZVRvRHN0KVxuICBpZiAoZXhpc3RzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvQ3dkOiByZWxhdGl2ZVRvRHN0LFxuICAgICAgdG9Ec3Q6IHNyY3BhdGhcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIGF3YWl0IGZzLmxzdGF0KHNyY3BhdGgpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVyci5tZXNzYWdlID0gZXJyLm1lc3NhZ2UucmVwbGFjZSgnbHN0YXQnLCAnZW5zdXJlU3ltbGluaycpXG4gICAgdGhyb3cgZXJyXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRvQ3dkOiBzcmNwYXRoLFxuICAgIHRvRHN0OiBwYXRoLnJlbGF0aXZlKGRzdGRpciwgc3JjcGF0aClcbiAgfVxufVxuXG5mdW5jdGlvbiBzeW1saW5rUGF0aHNTeW5jIChzcmNwYXRoLCBkc3RwYXRoKSB7XG4gIGlmIChwYXRoLmlzQWJzb2x1dGUoc3JjcGF0aCkpIHtcbiAgICBjb25zdCBleGlzdHMgPSBmcy5leGlzdHNTeW5jKHNyY3BhdGgpXG4gICAgaWYgKCFleGlzdHMpIHRocm93IG5ldyBFcnJvcignYWJzb2x1dGUgc3JjcGF0aCBkb2VzIG5vdCBleGlzdCcpXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvQ3dkOiBzcmNwYXRoLFxuICAgICAgdG9Ec3Q6IHNyY3BhdGhcbiAgICB9XG4gIH1cblxuICBjb25zdCBkc3RkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgY29uc3QgcmVsYXRpdmVUb0RzdCA9IHBhdGguam9pbihkc3RkaXIsIHNyY3BhdGgpXG4gIGNvbnN0IGV4aXN0cyA9IGZzLmV4aXN0c1N5bmMocmVsYXRpdmVUb0RzdClcbiAgaWYgKGV4aXN0cykge1xuICAgIHJldHVybiB7XG4gICAgICB0b0N3ZDogcmVsYXRpdmVUb0RzdCxcbiAgICAgIHRvRHN0OiBzcmNwYXRoXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3JjRXhpc3RzID0gZnMuZXhpc3RzU3luYyhzcmNwYXRoKVxuICBpZiAoIXNyY0V4aXN0cykgdGhyb3cgbmV3IEVycm9yKCdyZWxhdGl2ZSBzcmNwYXRoIGRvZXMgbm90IGV4aXN0JylcbiAgcmV0dXJuIHtcbiAgICB0b0N3ZDogc3JjcGF0aCxcbiAgICB0b0RzdDogcGF0aC5yZWxhdGl2ZShkc3RkaXIsIHNyY3BhdGgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN5bWxpbmtQYXRoczogdShzeW1saW5rUGF0aHMpLFxuICBzeW1saW5rUGF0aHNTeW5jXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnLi4vZnMnKVxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5cbmFzeW5jIGZ1bmN0aW9uIHN5bWxpbmtUeXBlIChzcmNwYXRoLCB0eXBlKSB7XG4gIGlmICh0eXBlKSByZXR1cm4gdHlwZVxuXG4gIGxldCBzdGF0c1xuICB0cnkge1xuICAgIHN0YXRzID0gYXdhaXQgZnMubHN0YXQoc3JjcGF0aClcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuICdmaWxlJ1xuICB9XG5cbiAgcmV0dXJuIChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSA/ICdkaXInIDogJ2ZpbGUnXG59XG5cbmZ1bmN0aW9uIHN5bWxpbmtUeXBlU3luYyAoc3JjcGF0aCwgdHlwZSkge1xuICBpZiAodHlwZSkgcmV0dXJuIHR5cGVcblxuICBsZXQgc3RhdHNcbiAgdHJ5IHtcbiAgICBzdGF0cyA9IGZzLmxzdGF0U3luYyhzcmNwYXRoKVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gJ2ZpbGUnXG4gIH1cbiAgcmV0dXJuIChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSA/ICdkaXInIDogJ2ZpbGUnXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzeW1saW5rVHlwZTogdShzeW1saW5rVHlwZSksXG4gIHN5bWxpbmtUeXBlU3luY1xufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB1ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JykuZnJvbVByb21pc2VcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnLi4vZnMnKVxuXG5jb25zdCB7IG1rZGlycywgbWtkaXJzU3luYyB9ID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcblxuY29uc3QgeyBzeW1saW5rUGF0aHMsIHN5bWxpbmtQYXRoc1N5bmMgfSA9IHJlcXVpcmUoJy4vc3ltbGluay1wYXRocycpXG5jb25zdCB7IHN5bWxpbmtUeXBlLCBzeW1saW5rVHlwZVN5bmMgfSA9IHJlcXVpcmUoJy4vc3ltbGluay10eXBlJylcblxuY29uc3QgeyBwYXRoRXhpc3RzIH0gPSByZXF1aXJlKCcuLi9wYXRoLWV4aXN0cycpXG5cbmNvbnN0IHsgYXJlSWRlbnRpY2FsIH0gPSByZXF1aXJlKCcuLi91dGlsL3N0YXQnKVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVTeW1saW5rIChzcmNwYXRoLCBkc3RwYXRoLCB0eXBlKSB7XG4gIGxldCBzdGF0c1xuICB0cnkge1xuICAgIHN0YXRzID0gYXdhaXQgZnMubHN0YXQoZHN0cGF0aClcbiAgfSBjYXRjaCB7IH1cblxuICBpZiAoc3RhdHMgJiYgc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgIGNvbnN0IFtzcmNTdGF0LCBkc3RTdGF0XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGZzLnN0YXQoc3JjcGF0aCksXG4gICAgICBmcy5zdGF0KGRzdHBhdGgpXG4gICAgXSlcblxuICAgIGlmIChhcmVJZGVudGljYWwoc3JjU3RhdCwgZHN0U3RhdCkpIHJldHVyblxuICB9XG5cbiAgY29uc3QgcmVsYXRpdmUgPSBhd2FpdCBzeW1saW5rUGF0aHMoc3JjcGF0aCwgZHN0cGF0aClcbiAgc3JjcGF0aCA9IHJlbGF0aXZlLnRvRHN0XG4gIGNvbnN0IHRvVHlwZSA9IGF3YWl0IHN5bWxpbmtUeXBlKHJlbGF0aXZlLnRvQ3dkLCB0eXBlKVxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcblxuICBpZiAoIShhd2FpdCBwYXRoRXhpc3RzKGRpcikpKSB7XG4gICAgYXdhaXQgbWtkaXJzKGRpcilcbiAgfVxuXG4gIHJldHVybiBmcy5zeW1saW5rKHNyY3BhdGgsIGRzdHBhdGgsIHRvVHlwZSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ltbGlua1N5bmMgKHNyY3BhdGgsIGRzdHBhdGgsIHR5cGUpIHtcbiAgbGV0IHN0YXRzXG4gIHRyeSB7XG4gICAgc3RhdHMgPSBmcy5sc3RhdFN5bmMoZHN0cGF0aClcbiAgfSBjYXRjaCB7IH1cbiAgaWYgKHN0YXRzICYmIHN0YXRzLmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICBjb25zdCBzcmNTdGF0ID0gZnMuc3RhdFN5bmMoc3JjcGF0aClcbiAgICBjb25zdCBkc3RTdGF0ID0gZnMuc3RhdFN5bmMoZHN0cGF0aClcbiAgICBpZiAoYXJlSWRlbnRpY2FsKHNyY1N0YXQsIGRzdFN0YXQpKSByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHJlbGF0aXZlID0gc3ltbGlua1BhdGhzU3luYyhzcmNwYXRoLCBkc3RwYXRoKVxuICBzcmNwYXRoID0gcmVsYXRpdmUudG9Ec3RcbiAgdHlwZSA9IHN5bWxpbmtUeXBlU3luYyhyZWxhdGl2ZS50b0N3ZCwgdHlwZSlcbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGRzdHBhdGgpXG4gIGNvbnN0IGV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZGlyKVxuICBpZiAoZXhpc3RzKSByZXR1cm4gZnMuc3ltbGlua1N5bmMoc3JjcGF0aCwgZHN0cGF0aCwgdHlwZSlcbiAgbWtkaXJzU3luYyhkaXIpXG4gIHJldHVybiBmcy5zeW1saW5rU3luYyhzcmNwYXRoLCBkc3RwYXRoLCB0eXBlKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlU3ltbGluazogdShjcmVhdGVTeW1saW5rKSxcbiAgY3JlYXRlU3ltbGlua1N5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgeyBjcmVhdGVGaWxlLCBjcmVhdGVGaWxlU3luYyB9ID0gcmVxdWlyZSgnLi9maWxlJylcbmNvbnN0IHsgY3JlYXRlTGluaywgY3JlYXRlTGlua1N5bmMgfSA9IHJlcXVpcmUoJy4vbGluaycpXG5jb25zdCB7IGNyZWF0ZVN5bWxpbmssIGNyZWF0ZVN5bWxpbmtTeW5jIH0gPSByZXF1aXJlKCcuL3N5bWxpbmsnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gZmlsZVxuICBjcmVhdGVGaWxlLFxuICBjcmVhdGVGaWxlU3luYyxcbiAgZW5zdXJlRmlsZTogY3JlYXRlRmlsZSxcbiAgZW5zdXJlRmlsZVN5bmM6IGNyZWF0ZUZpbGVTeW5jLFxuICAvLyBsaW5rXG4gIGNyZWF0ZUxpbmssXG4gIGNyZWF0ZUxpbmtTeW5jLFxuICBlbnN1cmVMaW5rOiBjcmVhdGVMaW5rLFxuICBlbnN1cmVMaW5rU3luYzogY3JlYXRlTGlua1N5bmMsXG4gIC8vIHN5bWxpbmtcbiAgY3JlYXRlU3ltbGluayxcbiAgY3JlYXRlU3ltbGlua1N5bmMsXG4gIGVuc3VyZVN5bWxpbms6IGNyZWF0ZVN5bWxpbmssXG4gIGVuc3VyZVN5bWxpbmtTeW5jOiBjcmVhdGVTeW1saW5rU3luY1xufVxuIiwgImZ1bmN0aW9uIHN0cmluZ2lmeSAob2JqLCB7IEVPTCA9ICdcXG4nLCBmaW5hbEVPTCA9IHRydWUsIHJlcGxhY2VyID0gbnVsbCwgc3BhY2VzIH0gPSB7fSkge1xuICBjb25zdCBFT0YgPSBmaW5hbEVPTCA/IEVPTCA6ICcnXG4gIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KG9iaiwgcmVwbGFjZXIsIHNwYWNlcylcblxuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcbi9nLCBFT0wpICsgRU9GXG59XG5cbmZ1bmN0aW9uIHN0cmlwQm9tIChjb250ZW50KSB7XG4gIC8vIHdlIGRvIHRoaXMgYmVjYXVzZSBKU09OLnBhcnNlIHdvdWxkIGNvbnZlcnQgaXQgdG8gYSB1dGY4IHN0cmluZyBpZiBlbmNvZGluZyB3YXNuJ3Qgc3BlY2lmaWVkXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoY29udGVudCkpIGNvbnRlbnQgPSBjb250ZW50LnRvU3RyaW5nKCd1dGY4JylcbiAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSgvXlxcdUZFRkYvLCAnJylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHN0cmluZ2lmeSwgc3RyaXBCb20gfVxuIiwgImxldCBfZnNcbnRyeSB7XG4gIF9mcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbn0gY2F0Y2ggKF8pIHtcbiAgX2ZzID0gcmVxdWlyZSgnZnMnKVxufVxuY29uc3QgdW5pdmVyc2FsaWZ5ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JylcbmNvbnN0IHsgc3RyaW5naWZ5LCBzdHJpcEJvbSB9ID0gcmVxdWlyZSgnLi91dGlscycpXG5cbmFzeW5jIGZ1bmN0aW9uIF9yZWFkRmlsZSAoZmlsZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0geyBlbmNvZGluZzogb3B0aW9ucyB9XG4gIH1cblxuICBjb25zdCBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgY29uc3Qgc2hvdWxkVGhyb3cgPSAndGhyb3dzJyBpbiBvcHRpb25zID8gb3B0aW9ucy50aHJvd3MgOiB0cnVlXG5cbiAgbGV0IGRhdGEgPSBhd2FpdCB1bml2ZXJzYWxpZnkuZnJvbUNhbGxiYWNrKGZzLnJlYWRGaWxlKShmaWxlLCBvcHRpb25zKVxuXG4gIGRhdGEgPSBzdHJpcEJvbShkYXRhKVxuXG4gIGxldCBvYmpcbiAgdHJ5IHtcbiAgICBvYmogPSBKU09OLnBhcnNlKGRhdGEsIG9wdGlvbnMgPyBvcHRpb25zLnJldml2ZXIgOiBudWxsKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoc2hvdWxkVGhyb3cpIHtcbiAgICAgIGVyci5tZXNzYWdlID0gYCR7ZmlsZX06ICR7ZXJyLm1lc3NhZ2V9YFxuICAgICAgdGhyb3cgZXJyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9ialxufVxuXG5jb25zdCByZWFkRmlsZSA9IHVuaXZlcnNhbGlmeS5mcm9tUHJvbWlzZShfcmVhZEZpbGUpXG5cbmZ1bmN0aW9uIHJlYWRGaWxlU3luYyAoZmlsZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0geyBlbmNvZGluZzogb3B0aW9ucyB9XG4gIH1cblxuICBjb25zdCBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgY29uc3Qgc2hvdWxkVGhyb3cgPSAndGhyb3dzJyBpbiBvcHRpb25zID8gb3B0aW9ucy50aHJvd3MgOiB0cnVlXG5cbiAgdHJ5IHtcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlLCBvcHRpb25zKVxuICAgIGNvbnRlbnQgPSBzdHJpcEJvbShjb250ZW50KVxuICAgIHJldHVybiBKU09OLnBhcnNlKGNvbnRlbnQsIG9wdGlvbnMucmV2aXZlcilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHNob3VsZFRocm93KSB7XG4gICAgICBlcnIubWVzc2FnZSA9IGAke2ZpbGV9OiAke2Vyci5tZXNzYWdlfWBcbiAgICAgIHRocm93IGVyclxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBfd3JpdGVGaWxlIChmaWxlLCBvYmosIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgY29uc3Qgc3RyID0gc3RyaW5naWZ5KG9iaiwgb3B0aW9ucylcblxuICBhd2FpdCB1bml2ZXJzYWxpZnkuZnJvbUNhbGxiYWNrKGZzLndyaXRlRmlsZSkoZmlsZSwgc3RyLCBvcHRpb25zKVxufVxuXG5jb25zdCB3cml0ZUZpbGUgPSB1bml2ZXJzYWxpZnkuZnJvbVByb21pc2UoX3dyaXRlRmlsZSlcblxuZnVuY3Rpb24gd3JpdGVGaWxlU3luYyAoZmlsZSwgb2JqLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZnMgPSBvcHRpb25zLmZzIHx8IF9mc1xuXG4gIGNvbnN0IHN0ciA9IHN0cmluZ2lmeShvYmosIG9wdGlvbnMpXG4gIC8vIG5vdCBzdXJlIGlmIGZzLndyaXRlRmlsZVN5bmMgcmV0dXJucyBhbnl0aGluZywgYnV0IGp1c3QgaW4gY2FzZVxuICByZXR1cm4gZnMud3JpdGVGaWxlU3luYyhmaWxlLCBzdHIsIG9wdGlvbnMpXG59XG5cbmNvbnN0IGpzb25maWxlID0ge1xuICByZWFkRmlsZSxcbiAgcmVhZEZpbGVTeW5jLFxuICB3cml0ZUZpbGUsXG4gIHdyaXRlRmlsZVN5bmNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBqc29uZmlsZVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBqc29uRmlsZSA9IHJlcXVpcmUoJ2pzb25maWxlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGpzb25maWxlIGV4cG9ydHNcbiAgcmVhZEpzb246IGpzb25GaWxlLnJlYWRGaWxlLFxuICByZWFkSnNvblN5bmM6IGpzb25GaWxlLnJlYWRGaWxlU3luYyxcbiAgd3JpdGVKc29uOiBqc29uRmlsZS53cml0ZUZpbGUsXG4gIHdyaXRlSnNvblN5bmM6IGpzb25GaWxlLndyaXRlRmlsZVN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5jb25zdCBmcyA9IHJlcXVpcmUoJy4uL2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IHBhdGhFeGlzdHMgPSByZXF1aXJlKCcuLi9wYXRoLWV4aXN0cycpLnBhdGhFeGlzdHNcblxuYXN5bmMgZnVuY3Rpb24gb3V0cHV0RmlsZSAoZmlsZSwgZGF0YSwgZW5jb2RpbmcgPSAndXRmLTgnKSB7XG4gIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlKVxuXG4gIGlmICghKGF3YWl0IHBhdGhFeGlzdHMoZGlyKSkpIHtcbiAgICBhd2FpdCBta2Rpci5ta2RpcnMoZGlyKVxuICB9XG5cbiAgcmV0dXJuIGZzLndyaXRlRmlsZShmaWxlLCBkYXRhLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gb3V0cHV0RmlsZVN5bmMgKGZpbGUsIC4uLmFyZ3MpIHtcbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG4gIGlmICghZnMuZXhpc3RzU3luYyhkaXIpKSB7XG4gICAgbWtkaXIubWtkaXJzU3luYyhkaXIpXG4gIH1cblxuICBmcy53cml0ZUZpbGVTeW5jKGZpbGUsIC4uLmFyZ3MpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvdXRwdXRGaWxlOiB1KG91dHB1dEZpbGUpLFxuICBvdXRwdXRGaWxlU3luY1xufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB7IHN0cmluZ2lmeSB9ID0gcmVxdWlyZSgnanNvbmZpbGUvdXRpbHMnKVxuY29uc3QgeyBvdXRwdXRGaWxlIH0gPSByZXF1aXJlKCcuLi9vdXRwdXQtZmlsZScpXG5cbmFzeW5jIGZ1bmN0aW9uIG91dHB1dEpzb24gKGZpbGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBzdHIgPSBzdHJpbmdpZnkoZGF0YSwgb3B0aW9ucylcblxuICBhd2FpdCBvdXRwdXRGaWxlKGZpbGUsIHN0ciwgb3B0aW9ucylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdXRwdXRKc29uXG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHsgc3RyaW5naWZ5IH0gPSByZXF1aXJlKCdqc29uZmlsZS91dGlscycpXG5jb25zdCB7IG91dHB1dEZpbGVTeW5jIH0gPSByZXF1aXJlKCcuLi9vdXRwdXQtZmlsZScpXG5cbmZ1bmN0aW9uIG91dHB1dEpzb25TeW5jIChmaWxlLCBkYXRhLCBvcHRpb25zKSB7XG4gIGNvbnN0IHN0ciA9IHN0cmluZ2lmeShkYXRhLCBvcHRpb25zKVxuXG4gIG91dHB1dEZpbGVTeW5jKGZpbGUsIHN0ciwgb3B0aW9ucylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdXRwdXRKc29uU3luY1xuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB1ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JykuZnJvbVByb21pc2VcbmNvbnN0IGpzb25GaWxlID0gcmVxdWlyZSgnLi9qc29uZmlsZScpXG5cbmpzb25GaWxlLm91dHB1dEpzb24gPSB1KHJlcXVpcmUoJy4vb3V0cHV0LWpzb24nKSlcbmpzb25GaWxlLm91dHB1dEpzb25TeW5jID0gcmVxdWlyZSgnLi9vdXRwdXQtanNvbi1zeW5jJylcbi8vIGFsaWFzZXNcbmpzb25GaWxlLm91dHB1dEpTT04gPSBqc29uRmlsZS5vdXRwdXRKc29uXG5qc29uRmlsZS5vdXRwdXRKU09OU3luYyA9IGpzb25GaWxlLm91dHB1dEpzb25TeW5jXG5qc29uRmlsZS53cml0ZUpTT04gPSBqc29uRmlsZS53cml0ZUpzb25cbmpzb25GaWxlLndyaXRlSlNPTlN5bmMgPSBqc29uRmlsZS53cml0ZUpzb25TeW5jXG5qc29uRmlsZS5yZWFkSlNPTiA9IGpzb25GaWxlLnJlYWRKc29uXG5qc29uRmlsZS5yZWFkSlNPTlN5bmMgPSBqc29uRmlsZS5yZWFkSnNvblN5bmNcblxubW9kdWxlLmV4cG9ydHMgPSBqc29uRmlsZVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJy4uL2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHsgY29weSB9ID0gcmVxdWlyZSgnLi4vY29weScpXG5jb25zdCB7IHJlbW92ZSB9ID0gcmVxdWlyZSgnLi4vcmVtb3ZlJylcbmNvbnN0IHsgbWtkaXJwIH0gPSByZXF1aXJlKCcuLi9ta2RpcnMnKVxuY29uc3QgeyBwYXRoRXhpc3RzIH0gPSByZXF1aXJlKCcuLi9wYXRoLWV4aXN0cycpXG5jb25zdCBzdGF0ID0gcmVxdWlyZSgnLi4vdXRpbC9zdGF0JylcblxuYXN5bmMgZnVuY3Rpb24gbW92ZSAoc3JjLCBkZXN0LCBvcHRzID0ge30pIHtcbiAgY29uc3Qgb3ZlcndyaXRlID0gb3B0cy5vdmVyd3JpdGUgfHwgb3B0cy5jbG9iYmVyIHx8IGZhbHNlXG5cbiAgY29uc3QgeyBzcmNTdGF0LCBpc0NoYW5naW5nQ2FzZSA9IGZhbHNlIH0gPSBhd2FpdCBzdGF0LmNoZWNrUGF0aHMoc3JjLCBkZXN0LCAnbW92ZScsIG9wdHMpXG5cbiAgYXdhaXQgc3RhdC5jaGVja1BhcmVudFBhdGhzKHNyYywgc3JjU3RhdCwgZGVzdCwgJ21vdmUnKVxuXG4gIC8vIElmIHRoZSBwYXJlbnQgb2YgZGVzdCBpcyBub3Qgcm9vdCwgbWFrZSBzdXJlIGl0IGV4aXN0cyBiZWZvcmUgcHJvY2VlZGluZ1xuICBjb25zdCBkZXN0UGFyZW50ID0gcGF0aC5kaXJuYW1lKGRlc3QpXG4gIGNvbnN0IHBhcnNlZFBhcmVudFBhdGggPSBwYXRoLnBhcnNlKGRlc3RQYXJlbnQpXG4gIGlmIChwYXJzZWRQYXJlbnRQYXRoLnJvb3QgIT09IGRlc3RQYXJlbnQpIHtcbiAgICBhd2FpdCBta2RpcnAoZGVzdFBhcmVudClcbiAgfVxuXG4gIHJldHVybiBkb1JlbmFtZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSwgaXNDaGFuZ2luZ0Nhc2UpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRvUmVuYW1lIChzcmMsIGRlc3QsIG92ZXJ3cml0ZSwgaXNDaGFuZ2luZ0Nhc2UpIHtcbiAgaWYgKCFpc0NoYW5naW5nQ2FzZSkge1xuICAgIGlmIChvdmVyd3JpdGUpIHtcbiAgICAgIGF3YWl0IHJlbW92ZShkZXN0KVxuICAgIH0gZWxzZSBpZiAoYXdhaXQgcGF0aEV4aXN0cyhkZXN0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdkZXN0IGFscmVhZHkgZXhpc3RzLicpXG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBUcnkgdy8gcmVuYW1lIGZpcnN0LCBhbmQgdHJ5IGNvcHkgKyByZW1vdmUgaWYgRVhERVZcbiAgICBhd2FpdCBmcy5yZW5hbWUoc3JjLCBkZXN0KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyLmNvZGUgIT09ICdFWERFVicpIHtcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgICBhd2FpdCBtb3ZlQWNyb3NzRGV2aWNlKHNyYywgZGVzdCwgb3ZlcndyaXRlKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1vdmVBY3Jvc3NEZXZpY2UgKHNyYywgZGVzdCwgb3ZlcndyaXRlKSB7XG4gIGNvbnN0IG9wdHMgPSB7XG4gICAgb3ZlcndyaXRlLFxuICAgIGVycm9yT25FeGlzdDogdHJ1ZSxcbiAgICBwcmVzZXJ2ZVRpbWVzdGFtcHM6IHRydWVcbiAgfVxuXG4gIGF3YWl0IGNvcHkoc3JjLCBkZXN0LCBvcHRzKVxuICByZXR1cm4gcmVtb3ZlKHNyYylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtb3ZlXG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgY29weVN5bmMgPSByZXF1aXJlKCcuLi9jb3B5JykuY29weVN5bmNcbmNvbnN0IHJlbW92ZVN5bmMgPSByZXF1aXJlKCcuLi9yZW1vdmUnKS5yZW1vdmVTeW5jXG5jb25zdCBta2RpcnBTeW5jID0gcmVxdWlyZSgnLi4vbWtkaXJzJykubWtkaXJwU3luY1xuY29uc3Qgc3RhdCA9IHJlcXVpcmUoJy4uL3V0aWwvc3RhdCcpXG5cbmZ1bmN0aW9uIG1vdmVTeW5jIChzcmMsIGRlc3QsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgY29uc3Qgb3ZlcndyaXRlID0gb3B0cy5vdmVyd3JpdGUgfHwgb3B0cy5jbG9iYmVyIHx8IGZhbHNlXG5cbiAgY29uc3QgeyBzcmNTdGF0LCBpc0NoYW5naW5nQ2FzZSA9IGZhbHNlIH0gPSBzdGF0LmNoZWNrUGF0aHNTeW5jKHNyYywgZGVzdCwgJ21vdmUnLCBvcHRzKVxuICBzdGF0LmNoZWNrUGFyZW50UGF0aHNTeW5jKHNyYywgc3JjU3RhdCwgZGVzdCwgJ21vdmUnKVxuICBpZiAoIWlzUGFyZW50Um9vdChkZXN0KSkgbWtkaXJwU3luYyhwYXRoLmRpcm5hbWUoZGVzdCkpXG4gIHJldHVybiBkb1JlbmFtZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSwgaXNDaGFuZ2luZ0Nhc2UpXG59XG5cbmZ1bmN0aW9uIGlzUGFyZW50Um9vdCAoZGVzdCkge1xuICBjb25zdCBwYXJlbnQgPSBwYXRoLmRpcm5hbWUoZGVzdClcbiAgY29uc3QgcGFyc2VkUGF0aCA9IHBhdGgucGFyc2UocGFyZW50KVxuICByZXR1cm4gcGFyc2VkUGF0aC5yb290ID09PSBwYXJlbnRcbn1cblxuZnVuY3Rpb24gZG9SZW5hbWUgKHNyYywgZGVzdCwgb3ZlcndyaXRlLCBpc0NoYW5naW5nQ2FzZSkge1xuICBpZiAoaXNDaGFuZ2luZ0Nhc2UpIHJldHVybiByZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG4gIGlmIChvdmVyd3JpdGUpIHtcbiAgICByZW1vdmVTeW5jKGRlc3QpXG4gICAgcmV0dXJuIHJlbmFtZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSlcbiAgfVxuICBpZiAoZnMuZXhpc3RzU3luYyhkZXN0KSkgdGhyb3cgbmV3IEVycm9yKCdkZXN0IGFscmVhZHkgZXhpc3RzLicpXG4gIHJldHVybiByZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG59XG5cbmZ1bmN0aW9uIHJlbmFtZSAoc3JjLCBkZXN0LCBvdmVyd3JpdGUpIHtcbiAgdHJ5IHtcbiAgICBmcy5yZW5hbWVTeW5jKHNyYywgZGVzdClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlICE9PSAnRVhERVYnKSB0aHJvdyBlcnJcbiAgICByZXR1cm4gbW92ZUFjcm9zc0RldmljZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlQWNyb3NzRGV2aWNlIChzcmMsIGRlc3QsIG92ZXJ3cml0ZSkge1xuICBjb25zdCBvcHRzID0ge1xuICAgIG92ZXJ3cml0ZSxcbiAgICBlcnJvck9uRXhpc3Q6IHRydWUsXG4gICAgcHJlc2VydmVUaW1lc3RhbXBzOiB0cnVlXG4gIH1cbiAgY29weVN5bmMoc3JjLCBkZXN0LCBvcHRzKVxuICByZXR1cm4gcmVtb3ZlU3luYyhzcmMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW92ZVN5bmNcbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbW92ZTogdShyZXF1aXJlKCcuL21vdmUnKSksXG4gIG1vdmVTeW5jOiByZXF1aXJlKCcuL21vdmUtc3luYycpXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBFeHBvcnQgcHJvbWlzZWlmaWVkIGdyYWNlZnVsLWZzOlxuICAuLi5yZXF1aXJlKCcuL2ZzJyksXG4gIC8vIEV4cG9ydCBleHRyYSBtZXRob2RzOlxuICAuLi5yZXF1aXJlKCcuL2NvcHknKSxcbiAgLi4ucmVxdWlyZSgnLi9lbXB0eScpLFxuICAuLi5yZXF1aXJlKCcuL2Vuc3VyZScpLFxuICAuLi5yZXF1aXJlKCcuL2pzb24nKSxcbiAgLi4ucmVxdWlyZSgnLi9ta2RpcnMnKSxcbiAgLi4ucmVxdWlyZSgnLi9tb3ZlJyksXG4gIC4uLnJlcXVpcmUoJy4vb3V0cHV0LWZpbGUnKSxcbiAgLi4ucmVxdWlyZSgnLi9wYXRoLWV4aXN0cycpLFxuICAuLi5yZXF1aXJlKCcuL3JlbW92ZScpXG59XG4iLCAiaW1wb3J0IEkxOG4gZnJvbSAnLi9zcmMvbWFpbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEkxOG5cclxuIiwgImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcclxuXHJcbmltcG9ydCB7IGFkZEljb24sIEFwcCwgTm90aWNlLCBQbHVnaW4sIFBsdWdpbk1hbmlmZXN0IH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBJMThuU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzL2RhdGEnO1xyXG5pbXBvcnQgeyBJMThuU2V0dGluZ1RhYiB9IGZyb20gJy4vc2V0dGluZ3MvdWknO1xyXG5pbXBvcnQgeyB0IH0gZnJvbSAnLi9sYW5nL2lueGRleCc7XHJcblxyXG5pbXBvcnQgeyBOb3RpY2VPcGVyYXRpb25SZXN1bHQsIE5vdGljZVdhcm5pbmcsIFN0YXRlIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IEkxOE5Nb2RhbCB9IGZyb20gJy4vbW9kYWwvaTE4bi1tb2RhbCc7XHJcbmltcG9ydCB7IFdpemFyZE1vZGFsIH0gZnJvbSAnLi9tb2RhbC93aXphcmQtbW9kYWwnO1xyXG4vLyBAdHMtaWdub3JlXHJcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBBUEkgfSBmcm9tICcuL2FwaSc7XHJcbmltcG9ydCB7IE1hbmlmZXN0IH0gZnJvbSAnLi9kYXRhL3R5cGVzJztcclxuXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gICAgICAgICAgW1x1NTE2NVx1NTNFM10gSTE4blxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSTE4TiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICAvLyBbXHU1M0Q4XHU5MUNGXSBcdTYwM0JcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcclxuICAgIHNldHRpbmdzOiBJMThuU2V0dGluZ3M7XHJcbiAgICBjdXJyZW50UGx1Z2luID0gJyc7XHJcbiAgICBhcGk6IEFQSTtcclxuICAgIGRpcmVjdG9yeTogTWFuaWZlc3RbXTtcclxuICAgIGlnbm9yZVBsdWdpbnM6IHN0cmluZ1tdO1xyXG4gICAgZGlyZWN0b3J5TWFyayA9IHRydWU7XHJcbiAgICBpZ25vcmVNYXJrID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBcdTVGNTNPYnNpZGlhblx1NTQyRlx1NTJBOFx1NjVGNlx1OUVEOFx1OEJBNFx1OEMwM1x1NzUyOFxyXG4gICAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGAlYyAke3RoaXMubWFuaWZlc3QubmFtZX0gJWMgdiR7dGhpcy5tYW5pZmVzdC52ZXJzaW9ufSBgLFxyXG4gICAgICAgICAgICBgcGFkZGluZzogMnB4OyBib3JkZXItcmFkaXVzOiAycHggMCAwIDJweDsgY29sb3I6ICNmZmY7IGJhY2tncm91bmQ6ICM1QjVCNUI7YCxcclxuICAgICAgICAgICAgYHBhZGRpbmc6IDJweDsgYm9yZGVyLXJhZGl1czogMCAycHggMnB4IDA7IGNvbG9yOiAjZmZmOyBiYWNrZ3JvdW5kOiAjNDA5RUZGO2AsXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBcdTk4OUNcdTgyNzIgYjNiM2IzIFx1NUI1OVx1ODhENVx1NkM3NiBcInRyYW5zbGF0ZVwiaWNvblxyXG4gICAgICAgIGFkZEljb24oXCJjbG91ZC11cGxvYWRcIiwgYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwibHVjaWRlIGx1Y2lkZS1jbG91ZC11cGxvYWRcIj48cGF0aCBkPVwiTTEyIDEzdjhcIi8+PHBhdGggZD1cIk00IDE0Ljg5OUE3IDcgMCAxIDEgMTUuNzEgOGgxLjc5YTQuNSA0LjUgMCAwIDEgMi41IDguMjQyXCIvPjxwYXRoIGQ9XCJtOCAxNyA0LTQgNCA0XCIvPjwvc3ZnPmApO1xyXG4gICAgICAgIGFkZEljb24oXCJjaXJjbGUtaGVscFwiLCBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJsdWNpZGUgbHVjaWRlLWNpcmNsZS1oZWxwXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTkuMDkgOWEzIDMgMCAwIDEgNS44MyAxYzAgMi0zIDMtMyAzXCIvPjxwYXRoIGQ9XCJNMTIgMTdoLjAxXCIvPjwvc3ZnPmApO1xyXG4gICAgICAgIGFkZEljb24oXCJpMThuX3RyYW5zbGF0ZVwiLCBgPHN2ZyB0PVwiMTcyNjE0NzY0NzE0MlwiIGNsYXNzPVwiaWNvblwiIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwLWlkPVwiNTYyNVwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+PHBhdGggZD1cIk0yMTMuMzMzMzMzIDY0MHY4NS4zMzMzMzNhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMCA3OC45MzMzMzQgODUuMDc3MzM0TDI5OC42NjY2NjcgODEwLjY2NjY2N2gxMjh2ODUuMzMzMzMzSDI5OC42NjY2NjdhMTcwLjY2NjY2NyAxNzAuNjY2NjY3IDAgMCAxLTE3MC42NjY2NjctMTcwLjY2NjY2N3YtODUuMzMzMzMzaDg1LjMzMzMzM3ogbTU1NC42NjY2NjctMjEzLjMzMzMzM2wxODcuNzMzMzMzIDQ2OS4zMzMzMzNoLTkxLjk0NjY2NmwtNTEuMjQyNjY3LTEyOGgtMTc0LjUwNjY2N2wtNTEuMTU3MzMzIDEyOGgtOTEuOTA0TDY4Mi42NjY2NjcgNDI2LjY2NjY2N2g4NS4zMzMzMzN6IG0tNDIuNjY2NjY3IDEyMy4wOTMzMzNMNjcyLjEyOCA2ODIuNjY2NjY3aDEwNi4zMjUzMzNMNzI1LjMzMzMzMyA1NDkuNzZ6TTM0MS4zMzMzMzMgODUuMzMzMzMzdjg1LjMzMzMzNGgxNzAuNjY2NjY3djI5OC42NjY2NjZIMzQxLjMzMzMzM3YxMjhIMjU2di0xMjhIODUuMzMzMzMzVjE3MC42NjY2NjdoMTcwLjY2NjY2N1Y4NS4zMzMzMzNoODUuMzMzMzMzeiBtMzg0IDQyLjY2NjY2N2ExNzAuNjY2NjY3IDE3MC42NjY2NjcgMCAwIDEgMTcwLjY2NjY2NyAxNzAuNjY2NjY3djg1LjMzMzMzM2gtODUuMzMzMzMzVjI5OC42NjY2NjdhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMC04NS4zMzMzMzQtODUuMzMzMzM0aC0xMjhWMTI4aDEyOHpNMjU2IDI1NkgxNzAuNjY2NjY3djEyOGg4NS4zMzMzMzNWMjU2eiBtMTcwLjY2NjY2NyAwSDM0MS4zMzMzMzN2MTI4aDg1LjMzMzMzNFYyNTZ6XCIgcC1pZD1cIjU2MjZcIiBmaWxsPVwiI2IzYjNiM1wiPjwvcGF0aD48L3N2Zz5gKTtcclxuICAgICAgICBhZGRJY29uKFwiaTE4bl9xcVwiLCBgPHN2ZyB0PVwiMTcyNjI4NTcwNTI2NlwiIGNsYXNzPVwiaWNvblwiIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwLWlkPVwiNDI5M1wiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+PHBhdGggZD1cIk04MjQuOCA2MTMuMmMtMTYtNTEuNC0zNC40LTk0LjYtNjIuNy0xNjUuM0M3NjYuNSAyNjIuMiA2ODkuMyAxMTIgNTExLjUgMTEyIDMzMS43IDExMiAyNTYuMiAyNjUuMiAyNjEgNDQ3LjljLTI4LjQgNzAuOC00Ni43IDExMy43LTYyLjcgMTY1LjMtMzQgMTA5LjUtMjMgMTU0LjgtMTQuNiAxNTUuOCAxOCAyLjIgNzAuMS04Mi40IDcwLjEtODIuNCAwIDQ5IDI1LjIgMTEyLjkgNzkuOCAxNTktMjYuNCA4LjEtODUuNyAyOS45LTcxLjYgNTMuOCAxMS40IDE5LjMgMTk2LjIgMTIuMyAyNDkuNSA2LjMgNTMuMyA2IDIzOC4xIDEzIDI0OS41LTYuMyAxNC4xLTIzLjgtNDUuMy00NS43LTcxLjYtNTMuOCA1NC42LTQ2LjIgNzkuOC0xMTAuMSA3OS44LTE1OSAwIDAgNTIuMSA4NC42IDcwLjEgODIuNCA4LjUtMS4xIDE5LjUtNDYuNC0xNC41LTE1NS44elwiIHAtaWQ9XCI0Mjk0XCIgZmlsbD1cIiNkYWRhZGFcIj48L3BhdGg+PC9zdmc+YCk7XHJcblxyXG4gICAgICAgIC8vIFtcdTUyQTBcdThGN0RdIFx1OTE0RFx1N0Y2RVxyXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICAgICAgLy8gW1x1NTJBMFx1OEY3RF0gQVBJXHJcbiAgICAgICAgdGhpcy5hcGkgPSBuZXcgQVBJKHRoaXMpO1xyXG4gICAgICAgIC8vIFtcdTUxRkRcdTY1NzBdIFx1OTk5Nlx1NkIyMVx1OEZEMFx1ODg0Q1xyXG4gICAgICAgIHRoaXMuZmlyc3RSdW4oKTtcclxuXHJcbiAgICAgICAgLy8gW1x1NTFGRFx1NjU3MF0gXHU0RTkxXHU3QUVGXHU1RkZEXHU3NTY1XHU2M0QyXHU0RUY2XHU3RjEzXHU1QjU4XHJcbiAgICAgICAgYXdhaXQgdGhpcy5pZ25vcmVDYWNoZSgpO1xyXG4gICAgICAgIC8vIFtcdTUxRkRcdTY1NzBdIFx1NEU5MVx1N0FFRlx1NzZFRVx1NUY1NVx1N0YxM1x1NUI1OFxyXG4gICAgICAgIGF3YWl0IHRoaXMuZGlyZWN0b3J5Q2FjaGUoKTtcclxuXHJcbiAgICAgICAgLy8gW1x1NTFGRFx1NjU3MF0gXHU4MUVBXHU1MkE4XHU2NkY0XHU2NUIwXHJcbiAgICAgICAgLy8gaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9BVVRPTUFUSUNfVVBEQVRFKSB0aGlzLmkxOG5BdXRvbWF0aWNVcGRhdGUodGhpcy5hcHApO1xyXG5cclxuICAgICAgICAvLyBbXHU1MjlGXHU4MEZEXSBcdTdGRkJcdThCRDFcclxuICAgICAgICB0aGlzLmFkZFJpYmJvbkljb24oJ2kxOG5fdHJhbnNsYXRlJywgJ1x1N0ZGQlx1OEJEMScsIChldnQ6IE1vdXNlRXZlbnQpID0+IHsgbmV3IEkxOE5Nb2RhbCh0aGlzLmFwcCwgdGhpcykub3BlbigpOyB9KTtcclxuICAgICAgICAvLyBbXHU4OUM2XHU1NkZFXSBcdTdGMTZcdThGOTFcdTU2NjhcclxuICAgICAgICAvLyB0aGlzLnJlZ2lzdGVyVmlldyhFRElUX1ZJRVdfVFlQRSwgKGxlYWYpID0+IG5ldyBFZGl0VmlldyhsZWFmKSk7XHJcbiAgICAgICAgLy8gXHU3MkI2XHU2MDAxXHU2ODBGXHJcbiAgICAgICAgLy8gdGhpcy5hZGRTdGF0dXNCYXJJdGVtKCkuc2V0VGV4dChgW1x1NkEyMVx1NUYwRl0gJHttb2RlW3RoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFXX1gKTtcclxuICAgICAgICAvLyBbXHU4QkJFXHU3RjZFXVxyXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgSTE4blNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gXHU1NDdEXHU1NDY4XHU2NzFGXHU1MUZEXHU2NTcwXHU1NzI4XHU2M0QyXHU0RUY2XHU4OEFCXHU3OTgxXHU3NTI4XHU2NUY2XHU4OUU2XHU1M0QxXHUzMDAyXHJcbiAgICBhc3luYyBvbnVubG9hZCgpIHtcclxuICAgICAgICAvLyBcdTUzNzhcdThGN0RcdTdGMTZcdThGOTFcdTg5QzZcdTU2RkVcclxuICAgICAgICAvLyB0aGlzLmFwcC53b3Jrc3BhY2UuZGV0YWNoTGVhdmVzT2ZUeXBlKEVESVRfVklFV19UWVBFKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICAvLyBcdTdGMTNcdTVCNTggXHU1RkZEXHU3NTY1XHU2M0QyXHU0RUY2XHJcbiAgICBhc3luYyBpZ25vcmVDYWNoZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5JMThOX0lHTk9SRSAmJiAhKHRoaXMuc2V0dGluZ3MuSTE4Tl9MQU5HVUFHRSBpbiB0aGlzLnNldHRpbmdzLkkxOE5fTkRUX0FQSVMpKSBOb3RpY2VXYXJuaW5nKCdcdTVGRkRcdTc1NjVcdTYzRDJcdTRFRjYnLCBgXHU1RjUzXHU1MjREXHU4QkVEXHU4QTAwIEFQSSBcdTRFMERcdTVCNThcdTU3MjhgKTtcclxuICAgICAgICAvLyBcdTZENEJcdThCRDVcdTgzQjdcdTUzRDZcdThCRDFcdTY1ODdcdTVCNTdcdTUxNzhcclxuICAgICAgICBjb25zdCBpZ25vcmVUZXN0ID0gYXdhaXQgdGhpcy5hcGkuaWdub3JlVGVzdCgpO1xyXG4gICAgICAgIC8vIFx1ODNCN1x1NTNENlx1NUZGRFx1NzU2NVx1NjNEMlx1NEVGNlxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLkkxOE5fSUdOT1JFICYmIHRoaXMuc2V0dGluZ3MuSTE4Tl9MQU5HVUFHRSBpbiB0aGlzLnNldHRpbmdzLkkxOE5fTkRUX0FQSVMgJiYgaWdub3JlVGVzdCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZ25vcmVQbHVnaW5zID0gYXdhaXQgdGhpcy5hcGkuaWdub3JlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlnbm9yZVBsdWdpbnMpXHJcbiAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NUZGRFx1NzU2NVx1NjNEMlx1NEVGNicsIHRydWUpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZ25vcmVNYXJrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NUZGRFx1NzU2NVx1NjNEMlx1NEVGNicsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9JR05PUkUgJiYgdGhpcy5zZXR0aW5ncy5JMThOX0xBTkdVQUdFIGluIHRoaXMuc2V0dGluZ3MuSTE4Tl9ORFRfQVBJUyAmJiAhaWdub3JlVGVzdCkge1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZU1hcmsgPSBmYWxzZTtcclxuICAgICAgICAgICAgTm90aWNlT3BlcmF0aW9uUmVzdWx0KCdcdTVGRkRcdTc1NjVcdTYzRDJcdTRFRjYnLCBmYWxzZSwgJ1x1N0Y1MVx1N0VEQ1x1NUYwMlx1NUUzOCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWdub3JlTWFyayA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gXHU3RjEzXHU1QjU4IFx1NEU5MVx1N0FFRlx1NzZFRVx1NUY1NVxyXG4gICAgYXN5bmMgZGlyZWN0b3J5Q2FjaGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFX05EVCAmJiAhKHRoaXMuc2V0dGluZ3MuSTE4Tl9MQU5HVUFHRSBpbiB0aGlzLnNldHRpbmdzLkkxOE5fTkRUX0FQSVMpKSBOb3RpY2VXYXJuaW5nKCdcdTRFOTFcdTdBRUZcdTZBMjFcdTVGMEYnLCBgXHU1RjUzXHU1MjREXHU4QkVEXHU4QTAwIEFQSSBcdTRFMERcdTVCNThcdTU3MjhgKTtcclxuICAgICAgICAvLyBcdTZENEJcdThCRDVcdTgzQjdcdTUzRDZcdThCRDFcdTY1ODdcdTVCNTdcdTUxNzhcclxuICAgICAgICBjb25zdCBkaXJlY3RvcnlUZXN0ID0gYXdhaXQgdGhpcy5hcGkuZGlyZWN0b3J5VGVzdCgpO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9ORFQgJiYgdGhpcy5zZXR0aW5ncy5JMThOX0xBTkdVQUdFIGluIHRoaXMuc2V0dGluZ3MuSTE4Tl9ORFRfQVBJUyAmJiBkaXJlY3RvcnlUZXN0KSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdG9yeSA9IGF3YWl0IHRoaXMuYXBpLmRpcmVjdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgTm90aWNlT3BlcmF0aW9uUmVzdWx0KCdcdTRFOTFcdTdBRUZcdTZBMjFcdTVGMEYnLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0b3J5TWFyayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgTm90aWNlT3BlcmF0aW9uUmVzdWx0KCdcdTRFOTFcdTdBRUZcdTZBMjFcdTVGMEYnLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9ORFQgJiYgdGhpcy5zZXR0aW5ncy5JMThOX0xBTkdVQUdFIGluIHRoaXMuc2V0dGluZ3MuSTE4Tl9ORFRfQVBJUyAmJiAhZGlyZWN0b3J5VGVzdCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpcmVjdG9yeU1hcmsgPSBmYWxzZTtcclxuICAgICAgICAgICAgTm90aWNlT3BlcmF0aW9uUmVzdWx0KCdcdTRFOTFcdTdBRUZcdTZBMjFcdTVGMEYnLCBmYWxzZSwgJ1x1N0Y1MVx1N0VEQ1x1NUYwMlx1NUUzOCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0b3J5TWFyayA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTk5OTZcdTZCMjFcdThGRDBcdTg4NENcclxuICAgIGZpcnN0UnVuKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLkkxOE5fV0laQVJEKSB7XHJcbiAgICAgICAgICAgIG5ldyBXaXphcmRNb2RhbCh0aGlzLmFwcCwgdGhpcykub3BlbigpO1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fVVVJRCA9IHV1aWR2NCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fV0laQVJEID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFx1ODFFQVx1NTJBOFx1NjZGNFx1NjVCMFx1NjNEMlx1NEVGNihcdTU5MzFcdTY1NDgpXHJcbiAgICBpMThuQXV0b21hdGljVXBkYXRlID0gKGFwcDogQXBwKSA9PiB7XHJcbiAgICAgICAgbGV0IHBsdWdpbnM6IFBsdWdpbk1hbmlmZXN0W10gPSBbXTtcclxuICAgICAgICBuZXcgTm90aWNlKCdcdTVGMDBcdTU5Q0JcdTY4QzBcdTY3RTVcdTY2RjRcdTY1QjAnKTtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgcGx1Z2lucyA9IE9iamVjdC52YWx1ZXMoYXBwLnBsdWdpbnMubWFuaWZlc3RzKTtcclxuICAgICAgICBwbHVnaW5zID0gcGx1Z2lucy5maWx0ZXIoaXRlbSA9PiBpdGVtLmlkICE9PSAnaTE4bicpO1xyXG4gICAgICAgIHBsdWdpbnMuc29ydCgoaXRlbTEsIGl0ZW0yKSA9PiB7IHJldHVybiBpdGVtMS5uYW1lLmxvY2FsZUNvbXBhcmUoaXRlbTIubmFtZSkgfSk7XHJcbiAgICAgICAgbGV0IHVwZGF0ZWl0ZW0gPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBwbHVnaW5zKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgY29uc3QgcGx1Z2luRGlyID0gcGF0aC5qb2luKHBhdGgubm9ybWFsaXplKGFwcC52YXVsdC5hZGFwdGVyLmdldEJhc2VQYXRoKCkpLCBwbHVnaW4uZGlyID8/ICcnKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxhbmdEaXIgPSBwYXRoLmpvaW4ocGx1Z2luRGlyLCAnbGFuZycpO1xyXG4gICAgICAgICAgICBjb25zdCBsYW5nRG9jID0gcGF0aC5qb2luKHBsdWdpbkRpciwgJ2xhbmcnLCBgJHt0aGlzLnNldHRpbmdzLkkxOE5fTEFOR1VBR0V9Lmpzb25gKTtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGVEb2MgPSBwYXRoLmpvaW4ocGx1Z2luRGlyLCAnbGFuZycsICdzdGF0ZS5qc29uJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpc0xhbmdEaXIgPSBmcy5wYXRoRXhpc3RzU3luYyhsYW5nRGlyKTtcclxuICAgICAgICAgICAgLy8gY29uc3QgaXNMYW5nRG9jID0gZnMucGF0aEV4aXN0c1N5bmMobGFuZ0RvYyk7XHJcbiAgICAgICAgICAgIGxldCBpc1N0YXRlRG9jID0gZnMucGF0aEV4aXN0c1N5bmMoc3RhdGVEb2MpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWFpbkRvYyA9IHBhdGguam9pbihwbHVnaW5EaXIsICdtYWluLmpzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGR1cGxpY2F0ZURvYyA9IHBhdGguam9pbihwbHVnaW5EaXIsICdkdXBsaWNhdGUuanMnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFx1NTIxQlx1NUVGQVx1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNlx1NUJGOVx1OEM2MVxyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZU9iaiA9IG5ldyBTdGF0ZShzdGF0ZURvYyk7XHJcbiAgICAgICAgICAgIC8vIFx1NUY1M1x1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNlx1NEUwRFx1NUI1OFx1NTcyOFx1NjVGNlx1NTIxQlx1NUVGQVx1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNlxyXG4gICAgICAgICAgICBpZiAoaXNMYW5nRGlyICYmICFpc1N0YXRlRG9jKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlT2JqLmluc2VydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzU3RhdGVEb2MgPSBmcy5wYXRoRXhpc3RzU3luYyhzdGF0ZURvYyk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYFx1MjZBMCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFx1MjZBMCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBcdTVGNTNcdThGRDBcdTg4NENcdTUyMzBcdThGRDlcdTkxQ0NcdTk3NjJcdTc2ODRcdTY1RjZcdTUwMTlcdTRFNUZcdTVDMzFcdTY2MkZcdTYxMEZcdTU0NzNcdTc3NDBcdTYzRDJcdTRFRjZcdTVERjJcdTdFQ0ZcdTY2RjRcdTY1QjBcdTRFODZcclxuICAgICAgICAgICAgaWYgKGlzU3RhdGVEb2MgJiYgc3RhdGVPYmouc3RhdGUoKSAmJiBwbHVnaW4udmVyc2lvbiAhPSBzdGF0ZU9iai5wbHVnaW5WZXJzaW9uKCkpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU1MkEwXHU2NTcwXHU5MUNGXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlaXRlbSA9IHVwZGF0ZWl0ZW0gKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vID09PT09XHU4RkQ4XHU1MzlGXHU2M0QyXHU0RUY2PT09PT1cclxuICAgICAgICAgICAgICAgICAgICAvLyAxLiBcdTUyMjBcdTk2NjRcdTU5MDdcdTRFRkRcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgICAgICAgICBmcy5yZW1vdmVTeW5jKGR1cGxpY2F0ZURvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMi4gXHU5MUNEXHU3RjZFXHU3MkI2XHU2MDAxXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVPYmoucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyA9PT09PVx1N0ZGQlx1OEJEMVx1NjNEMlx1NEVGNj09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMS4gXHU1OTBEXHU1MjM2XHU1OTA3XHU0RUZEXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAgICAgZnMuY29weVN5bmMobWFpbkRvYywgZHVwbGljYXRlRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAyLiBcdThCRkJcdTUzRDZcdThCRDFcdTY1ODdcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbkpzb24gPSBmcy5yZWFkSnNvblN5bmMobGFuZ0RvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMy4gXHU4QkZCXHU1M0Q2IG1haW4uanNcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWFpblN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhtYWluRG9jKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDQuIFx1N0ZGQlx1OEJEMSBtYWluLmpzXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdHJhbnNsYXRpb25Kc29uLmRpY3QpIG1haW5TdHJpbmcgPSBtYWluU3RyaW5nLnJlcGxhY2VBbGwoa2V5LCB0cmFuc2xhdGlvbkpzb24uZGljdFtrZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyA1LiBcdTUxOTlcdTUxNjUgbWFpbi5qc1xyXG4gICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFpbkRvYywgbWFpblN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gNi4gXHU2NkY0XHU2NUIwXHU3MkI2XHU2MDAxXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVPYmoudXBkYXRlKHRydWUsIHBsdWdpbi52ZXJzaW9uLCB0cmFuc2xhdGlvbkpzb24ubWFuaWZlc3QudmVyc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0KCdUUkFOU0xBVEVfTlBUSUNFJykpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShgXHUyNkEwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgXHUyNkEwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVwZGF0ZWl0ZW0gPT0gMCkge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGBcdTZDQTFcdTY3MDlcdTk3MDBcdTg5ODFcdTY2RjRcdTY1QjBcdTc2ODRcdTYzRDJcdTRFRjZgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGBcdTgxRUFcdTUyQThcdTY2RjRcdTY1QjAke3VwZGF0ZWl0ZW19XHU0RTJBXHU2M0QyXHU0RUY2YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIiwgImltcG9ydCB7IEJBSURVIH0gZnJvbSAnLi4vZGF0YS90eXBlcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEkxOG5TZXR0aW5ncyB7XHJcblx0STE4Tl9VVUlEOiBzdHJpbmc7XHJcblx0STE4Tl9XSVpBUkQ6IGJvb2xlYW47XHJcblx0Ly8gXHU3RkZCXHU4QkQxXHU4QkVEXHU4QTAwXHJcblx0STE4Tl9MQU5HVUFHRTogc3RyaW5nO1xyXG5cclxuXHRJMThOX01PREVfTERUOiBib29sZWFuLFxyXG5cdEkxOE5fTU9ERV9ORFQ6IGJvb2xlYW4sXHJcblx0STE4Tl9NT0RFX05JVDogYm9vbGVhbixcclxuXHJcblx0Ly8gXHU3QjdFXHU1NDBEXHJcblx0STE4Tl9BVVRIT1I6IHN0cmluZztcclxuXHQvLyBcdTgxRUFcdTUyQThcdTY2RjRcdTY1QjBcclxuXHRJMThOX0FVVE9NQVRJQ19VUERBVEU6IGJvb2xlYW47XHJcblx0Ly8gXHU4QkQxXHU2NTg3XHU3RjE2XHU4RjkxXHJcblx0STE4Tl9FRElUX01PREU6IGJvb2xlYW47XHJcblx0Ly8gXHU2MjUzXHU1RjAwXHU4QkJFXHU3RjZFXHJcblx0STE4Tl9PUEVOX1NFVFRJTkdTOiBib29sZWFuO1xyXG5cdC8vIFx1OEJEMVx1NjU4N1x1NjNEMFx1NEVBNFxyXG5cdEkxOE5fU1VCTUlUX1RSQU5TTEFUSU9OX01PREU6IGJvb2xlYW47XHJcblx0Ly8gXHU4QkQxXHU2NTg3XHU2QzQyXHU4QkQxXHJcblx0STE4Tl9SRVFVRVNUX1RSQU5TTEFUSU9OX01PREU6IGJvb2xlYW47XHJcblx0Ly8gXHU1RkZEXHU3NTY1XHU2M0QyXHU0RUY2XHJcblx0STE4Tl9JR05PUkU6IGJvb2xlYW47XHJcblxyXG5cdC8vIFx1NTMzOVx1OTE0RFx1OTE0RFx1N0Y2RVxyXG5cdEkxOE5fUkVfTU9ERTogc3RyaW5nO1xyXG5cdEkxOE5fUkVfRkxBR1M6IHN0cmluZztcclxuXHRJMThOX1JFX0xFTkdUSDogbnVtYmVyO1xyXG5cdEkxOE5fUkVfTU9ERV9FRElUOiBib29sZWFuLFxyXG5cdEkxOE5fUkVfTU9ERV9ESVNQTEFZOiBib29sZWFuO1xyXG5cdEkxOE5fUkVfREFUQVNfRElTUExBWTogYm9vbGVhbjtcclxuXHRJMThOX1JFX01PREVTOiBzdHJpbmdbXTtcclxuXHRJMThOX1JFX0RBVEFTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT47XHJcblxyXG5cdEkxOE5fTklUX0FQSTogc3RyaW5nO1xyXG5cdEkxOE5fTklUX0FQSV9JTlRFUlZBTDogbnVtYmVyLFxyXG5cclxuXHRJMThOX05EVF9BUElTX0RJU1BMQVk6IGJvb2xlYW47XHJcblx0STE4Tl9ORFRfQVBJUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxuXHRJMThOX05JVF9BUElTOiB7XHJcblx0XHRCQUlEVTogQkFJRFVcclxuXHR9O1xyXG5cclxuXHRJMThOX05JVF9PUEVOQUlfVVJMOiBzdHJpbmcsXHJcblx0STE4Tl9OSVRfT1BFTkFJX0tFWTogc3RyaW5nLFxyXG5cdEkxOE5fTklUX09QRU5BSV9NT0RFTDogc3RyaW5nLFxyXG5cdEkxOE5fTklUX09QRU5BSV9USVBTOiBzdHJpbmcsXHJcblxyXG5cdEkxOE5fU0VBUkNIX1RFWFQ6IHN0cmluZyxcclxuXHRJMThOX1NPUlQ6IHN0cmluZztcclxuXHRJMThOX1RZUEU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEkxOG5TZXR0aW5ncyA9IHtcclxuXHRJMThOX1VVSUQ6ICcnLFxyXG5cdEkxOE5fV0laQVJEOiB0cnVlLFxyXG5cdEkxOE5fTEFOR1VBR0U6ICd6aC1jbicsXHJcblxyXG5cdEkxOE5fTU9ERV9MRFQ6IHRydWUsXHJcblx0STE4Tl9NT0RFX05EVDogZmFsc2UsXHJcblx0STE4Tl9NT0RFX05JVDogZmFsc2UsXHJcblx0Ly8gXHU3QjdFXHU1QjU3XHJcblx0STE4Tl9BVVRIT1I6ICcnLFxyXG5cdC8vIFx1ODFFQVx1NTJBOFx1NjZGNFx1NjVCMFxyXG5cdEkxOE5fQVVUT01BVElDX1VQREFURTogZmFsc2UsXHJcblx0Ly8gXHU4QkQxXHU2NTg3XHU3RjE2XHU4RjkxXHJcblx0STE4Tl9FRElUX01PREU6IHRydWUsXHJcblx0Ly8gXHU2MjUzXHU1RjAwXHU4QkJFXHU3RjZFXHJcblx0STE4Tl9PUEVOX1NFVFRJTkdTOiBmYWxzZSxcclxuXHQvLyBcdThCRDFcdTY1ODdcdTYzRDBcdTRFQTRcclxuXHRJMThOX1NVQk1JVF9UUkFOU0xBVElPTl9NT0RFOiB0cnVlLFxyXG5cdC8vIFx1OEJEMVx1NjU4N1x1NkM0Mlx1OEJEMVxyXG5cdEkxOE5fUkVRVUVTVF9UUkFOU0xBVElPTl9NT0RFOiBmYWxzZSxcclxuXHQvLyBcdTVGRkRcdTc1NjVcdTYzRDJcdTRFRjZcclxuXHRJMThOX0lHTk9SRTogdHJ1ZSxcclxuXHJcblx0Ly8gXHU1MzM5XHU5MTREXHU2QTIxXHU1RjBGXHU5MTREXHU3RjZFXHJcblx0STE4Tl9SRV9NT0RFOiAnXHU5RUQ4XHU4QkE0JyxcclxuXHRJMThOX1JFX0ZMQUdTOiAnZ3MnLFxyXG5cdEkxOE5fUkVfTEVOR1RIOiAzMDAsXHJcblx0STE4Tl9SRV9NT0RFX0VESVQ6IGZhbHNlLFxyXG5cdEkxOE5fUkVfTU9ERV9ESVNQTEFZOiBmYWxzZSxcclxuXHRJMThOX1JFX0RBVEFTX0RJU1BMQVk6IGZhbHNlLFxyXG5cdEkxOE5fUkVfTU9ERVM6IFsnXHU5RUQ4XHU4QkE0J10sXHJcblx0STE4Tl9SRV9EQVRBUzoge1xyXG5cdFx0J1x1OUVEOFx1OEJBNCc6IFtcIk5vdGljZVxcXFwoXFxcXHMqKC4rPylcXFxccypcXFxcKS9nc1wiLFxyXG5cdFx0XHRcIi5zZXRUZXh0XFxcXChcXFxccyooWydcXFwiYF0pKC4rPylcXFxcMVxcXFxzKlxcXFwpXCIsXHJcblx0XHRcdFwiLnNldEJ1dHRvblRleHRcXFxcKFxcXFxzKihbJ1xcXCJgXSkoLis/KVxcXFwxXFxcXHMqXFxcXClcIixcclxuXHRcdFx0XCIuc2V0TmFtZVxcXFwoXFxcXHMqKFsnXFxcImBdKSguKz8pXFxcXDFcXFxccypcXFxcKVwiLFxyXG5cdFx0XHRcIi5zZXREZXNjXFxcXChcXFxccyooWydcXFwiYF0pKC4rPylcXFxcMVxcXFxzKlxcXFwpXCIsXHJcblx0XHRcdFwiLnNldFBsYWNlaG9sZGVyXFxcXChcXFxccyooWydcXFwiYF0pKC4rPylcXFxcMVxcXFxzKlxcXFwpXCIsXHJcblx0XHRcdFwiLnNldFRvb2x0aXBcXFxcKFxcXFxzKihbJ1xcXCJgXSkoLis/KVxcXFwxXFxcXHMqXFxcXClcIixcclxuXHRcdFx0XCIuYXBwZW5kVGV4dFxcXFwoXFxcXHMqKFsnXFxcImBdKSguKz8pXFxcXDFcXFxccypcXFxcKVwiLFxyXG5cdFx0XHRcIi5jcmVhdGVFbFxcXFwoKFsnXFxcImBdKShbXFxcXHc6LV0rKVxcXFwxLFxcXFxzKlxcXFx7XFxcXHMqdGV4dDpcXFxccyooWydcXFwiYF0pKC4rPylcXFxcM1xcXFxzKlxcXFx9XFxcXHMqXFxcXClcIixcclxuXHRcdFx0XCIuaW5uZXJUZXh0XFxcXHMqPVxcXFxzKihbJ1xcXCJgXSkuKj9cXFxcMVwiXHJcblx0XHRdXHJcblx0fSxcclxuXHJcblx0Ly8gXHU3RjUxXHU3RURDXHU2NTg3XHU0RUY2XHU5MTREXHU3RjZFXHJcblx0STE4Tl9ORFRfQVBJU19ESVNQTEFZOiBmYWxzZSxcclxuXHRJMThOX05EVF9BUElTOiB7XHJcblx0XHRcInpoLWNuXCI6IFwiaHR0cHM6Ly9naXRlZS5jb20vemVyby0tdHdvL29ic2lkaWFuLWkxOG4tdHJhbnNsYXRpb24vcmF3L21hc3Rlci96aC1jbi9cIlxyXG5cdH0sXHJcblxyXG5cdC8vIFx1N0Y1MVx1N0VEQ1x1NjNBNVx1NTNFM1x1OTE0RFx1N0Y2RVxyXG5cdEkxOE5fTklUX0FQSTogJ0JBSURVJyxcclxuXHRJMThOX05JVF9BUElfSU5URVJWQUw6IDUwMCxcclxuXHRJMThOX05JVF9BUElTOiB7XHJcblx0XHRCQUlEVToge1xyXG5cdFx0XHRGUk9NOiAnYXV0bycsXHJcblx0XHRcdFRPOiAnemgnLFxyXG5cdFx0XHRBUFBfSUQ6ICcnLFxyXG5cdFx0XHRLRVk6ICcnXHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0STE4Tl9OSVRfT1BFTkFJX1VSTDogJ2h0dHBzOi8vYXBpLm9wZW5haS5jb20nLFxyXG5cdEkxOE5fTklUX09QRU5BSV9LRVk6ICcnLFxyXG5cdEkxOE5fTklUX09QRU5BSV9NT0RFTDogJ2dwdC0zLjUtdHVyYm8nLFxyXG5cdEkxOE5fTklUX09QRU5BSV9USVBTOiAnXHU0RjYwXHU2NjJGXHU0RTAwXHU0RTJBXHU3RkZCXHU4QkQxXHU1REU1XHU0RjVDXHU4MDA1XHVGRjBDXHU0RjYwXHU1QzA2XHU4RkRCXHU4ODRDb2JzaWRpYW5cdTdCMTRcdThCQjBcdThGNkZcdTRFRjZcdTc2ODRcdTYzRDJcdTRFRjZcdTdGRkJcdThCRDFcdUZGMENcdTY3MkNcdTZCMjFcdTdGRkJcdThCRDFcdTc2ODRcdTYzRDJcdTRFRjZcdTU0MERcdTc5RjBcdTRFM0E6ICR7cGx1Z2lufVx1RkYwQ1x1OEJGN1x1N0VEM1x1NTQwOFx1NjNEMlx1NEVGNlx1NTQwRFx1NzlGMFx1NEVFNVx1NTNDQVx1OEY2Rlx1NEVGNlx1N0ZGQlx1OEJEMVx1NzY4NFx1NjgwN1x1NTFDNlx1OEZEQlx1ODg0Q1x1NTQwRVx1N0VFRFx1NURFNVx1NEY1Q1x1RkYwQ1x1NTZFMFx1NEUzQVx1NTkyN1x1NTkxQVx1NjU3MFx1NjU4N1x1NjcyQ1x1OTU3Rlx1NUVBNlx1OEY4M1x1NzdFRFx1RkYwQ1x1OEJGN1x1NEVFNVx1N0IyNlx1NTQwOFx1NEUyRFx1NjU4N1x1NEU2MFx1NjBFRlx1NzY4NFx1NjVCOVx1NUYwRlx1N0ZGQlx1OEJEMVx1MzAwMlx1NjNBNVx1NEUwQlx1Njc2NVx1NjIxMVx1NEYxQVx1NjNEMFx1NEVBNFx1N0VEOVx1NEY2MFx1NUY4OFx1NTkxQVx1ODJGMVx1NjU4N1x1NjU4N1x1NjcyQ1x1RkYwQ1x1OEJGN1x1NUMwNlx1NTE3Nlx1N0ZGQlx1OEJEMVx1NEUzQVx1N0I4MFx1NEY1M1x1NEUyRFx1NjU4N1x1RkYwQ1x1NUU3Nlx1NEUxNFx1NTNFQVx1OEZENFx1NTZERVx1N0VEOVx1NjIxMVx1N0ZGQlx1OEJEMVx1NTQwRVx1NzY4NFx1NTE4NVx1NUJCOScsXHJcblxyXG5cdEkxOE5fU0VBUkNIX1RFWFQ6ICcnLFxyXG5cdEkxOE5fU09SVDogJzAnLFxyXG5cdEkxOE5fVFlQRTogJzAnXHJcbn1cclxuIiwgImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IEkxOE4gZnJvbSBcIi4uLy4uL21haW5cIjtcclxuXHJcbmltcG9ydCBJMThuSGVscCBmcm9tICcuL2kxOG4taGVscCc7XHJcbmltcG9ydCBJMThuTGFuZ3VhZ2UgZnJvbSAnLi9pMThuLWxhbmd1YWdlJztcclxuaW1wb3J0IEkxOG5Nb2RMRFQgZnJvbSAnLi9pMThuLW1vZC1sZHQnO1xyXG5pbXBvcnQgSTE4bk1vZE5EVCBmcm9tICcuL2kxOG4tbW9kLW5kdCc7XHJcbmltcG9ydCBJMThuTmR0QXBpIGZyb20gJy4vaTE4bi1uZHQtYXBpJztcclxuaW1wb3J0IEkxOG5Nb2RlTklUIGZyb20gJy4vaTE4bi1tb2Qtbml0JztcclxuaW1wb3J0IEkxOG5OaXRCYWlEdSBmcm9tICcuL2kxOG4tbml0LWJhaWR1JztcclxuXHJcbmltcG9ydCBJMThuQXV0aG9yIGZyb20gJy4vaTE4bi1hdXRob3InO1xyXG4vLyBpbXBvcnQgSTE4bkF1dG9tYXRpY1VwZGF0ZSBmcm9tICcuL2kxOG4tYXV0b21hdGljLXVwZGF0ZSc7XHJcbmltcG9ydCBJMThuT3BlblNldHRpbmdzIGZyb20gJy4vaTE4bi1vcGVuLXNldHRpbmdzJztcclxuaW1wb3J0IEkxOG5BSU9wZW5BSSBmcm9tICcuL2kxOG4tbml0LW9wZW5BSSc7XHJcbmltcG9ydCBJMThuRWRpdE1vZGUgZnJvbSAnLi9pMThuLWVkaXQtbW9kZSc7XHJcbmltcG9ydCBJMThuU3VibWl0ZVRyYW5zbGF0aW9uTW9kZSBmcm9tICcuL2kxOG4tc3VibWl0ZS10cmFuc2xhdGlvbic7XHJcbi8vIGltcG9ydCBJMThuUmVxdWVzdFRyYW5zbGF0aW9uTW9kZSBmcm9tICcuL2kxOG4tcmVxdWVzdC10cmFuc2xhdGlvbic7XHJcbmltcG9ydCBJMThuSWdub3JlIGZyb20gJy4vaTE4bi1pZ25vcmUnO1xyXG5cclxuaW1wb3J0IEkxOG5SRSBmcm9tICcuL2kxOG4tcmUnO1xyXG5cclxuXHJcbmNsYXNzIEkxOG5TZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcblx0aTE4bjogSTE4TjtcclxuXHRhcHA6IEFwcDtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIGkxOG46IEkxOE4pIHtcclxuXHRcdHN1cGVyKGFwcCwgaTE4bik7XHJcblx0XHR0aGlzLmkxOG4gPSBpMThuO1xyXG5cdFx0dGhpcy5hcHAgPSBhcHA7XHJcblx0fVxyXG5cclxuXHRkaXNwbGF5KCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoJ1x1NTdGQVx1Nzg0MFx1OEJCRVx1N0Y2RScpLnNldEhlYWRpbmcoKTtcclxuXHRcdG5ldyBJMThuSGVscCh0aGlzKS5kaXNwbGF5KCk7XHJcblx0XHRuZXcgSTE4bkxhbmd1YWdlKHRoaXMpLmRpc3BsYXkoKTtcclxuXHRcdG5ldyBJMThuTW9kTERUKHRoaXMpLmRpc3BsYXkoKTtcclxuXHRcdG5ldyBJMThuTW9kTkRUKHRoaXMpLmRpc3BsYXkoKTtcclxuXHRcdG5ldyBJMThuTmR0QXBpKHRoaXMpLmRpc3BsYXkoKTtcclxuXHRcdG5ldyBJMThuTW9kZU5JVCh0aGlzKS5kaXNwbGF5KCk7XHJcblx0XHRuZXcgSTE4bk5pdEJhaUR1KHRoaXMpLmRpc3BsYXkoKTtcclxuXHRcdG5ldyBJMThuQUlPcGVuQUkodGhpcykuZGlzcGxheSgpO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKCdcdTY2RjRcdTU5MUFcdTUyOUZcdTgwRkQnKS5zZXRIZWFkaW5nKCk7XHJcblx0XHRuZXcgSTE4bkF1dGhvcih0aGlzKS5kaXNwbGF5KCk7XHJcblx0XHQvLyBuZXcgSTE4bkF1dG9tYXRpY1VwZGF0ZSh0aGlzKS5kaXNwbGF5KCk7XHJcblx0XHRuZXcgSTE4bk9wZW5TZXR0aW5ncyh0aGlzKS5kaXNwbGF5KCk7XHJcblx0XHRuZXcgSTE4bkVkaXRNb2RlKHRoaXMpLmRpc3BsYXkoKTtcclxuXHRcdG5ldyBJMThuU3VibWl0ZVRyYW5zbGF0aW9uTW9kZSh0aGlzKS5kaXNwbGF5KCk7XHJcblx0XHQvLyBuZXcgSTE4blJlcXVlc3RUcmFuc2xhdGlvbk1vZGUodGhpcykuZGlzcGxheSgpO1xyXG5cdFx0bmV3IEkxOG5JZ25vcmUodGhpcykuZGlzcGxheSgpO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKCdcdTUzMzlcdTkxNERcdTZBMjFcdTVGMEZcdTkxNERcdTdGNkUnKS5zZXRIZWFkaW5nKCk7XHJcblx0XHRuZXcgSTE4blJFKHRoaXMpLmRpc3BsYXkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7IEkxOG5TZXR0aW5nVGFiIH07XHJcblxyXG4iLCAiaW1wb3J0IHsgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgQmFzZVNldHRpbmcgZnJvbSBcIi4vYmFzZS1zZXR0aW5nXCI7XHJcbmltcG9ydCB7IFBOb3RpY2UgfSBmcm9tIFwic3JjL3V0aWxzXCI7XHJcbmltcG9ydCBVcmwgZnJvbSBcInNyYy91cmxcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEkxOG5IZWxwIGV4dGVuZHMgQmFzZVNldHRpbmcge1xyXG5cdG1haW4oKTogdm9pZCB7XHJcblx0XHRjb25zdCBJMThuSGVscCA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG5cdFx0STE4bkhlbHAuc2V0TmFtZSgnXHU1RTJFXHU1MkE5Jyk7XHJcblx0XHRJMThuSGVscC5hZGRCdXR0b24oY2IgPT4gY2JcclxuXHRcdFx0LnNldEJ1dHRvblRleHQoJ1x1OUUyM1x1OEMyMicpXHJcblx0XHRcdC5vbkNsaWNrKCgpID0+IHtcclxuXHRcdFx0XHRQTm90aWNlKCdcdTY1ODdcdTY4NjMnLCAnXFxuZGFuZ2VodWInKTtcclxuXHRcdFx0XHRQTm90aWNlKCdcdTVFRkFcdThCQUUnLCAnXFxuY3ViZXJ3dScpO1xyXG5cdFx0XHRcdFBOb3RpY2UoJ1x1OEJEMVx1NjU4NycsICdcXG5GRU5ESScpO1xyXG5cdFx0XHR9KVxyXG5cdFx0KTtcclxuXHRcdEkxOG5IZWxwLmFkZEJ1dHRvbihjYiA9PiBjYlxyXG5cdFx0XHQuc2V0QnV0dG9uVGV4dCgnXHU2NTg3XHU2ODYzJylcclxuXHRcdFx0Lm9uQ2xpY2soKCkgPT4ge1xyXG5cdFx0XHRcdC8vIGV4ZWMoYHN0YXJ0ICR7dXJsfWApO1xyXG5cdFx0XHRcdHdpbmRvdy5vcGVuKFVybC5ET0NVTUVOVEFUSU9OX1RVVE9SSUFMKTtcclxuXHRcdFx0fSlcclxuXHRcdCk7XHJcblx0XHQvLyBJMThuSGVscC5hZGRCdXR0b24oY2IgPT4gY2JcclxuXHRcdC8vIFx0LnNldEJ1dHRvblRleHQoJ1x1NjU1OVx1N0EwQicpXHJcblx0XHQvLyBcdC5vbkNsaWNrKCgpID0+IHtcclxuXHRcdC8vIFx0XHRQTm90aWNlKCdcdTY1NTlcdTdBMEInLCAnXHU2NTZDXHU4QkY3XHU2NzFGXHU1Rjg1Jyk7XHJcblx0XHQvLyBcdH0pXHJcblx0XHQvLyApO1xyXG5cdFx0Ly8gSTE4bkhlbHAuYWRkQnV0dG9uKGNiID0+IGNiXHJcblx0XHQvLyBcdC5zZXRCdXR0b25UZXh0KCdRUScpXHJcblx0XHQvLyBcdC5vbkNsaWNrKCgpID0+IHtcclxuXHRcdC8vIFx0XHRjb25zdCB1cmwgPSAnaHR0cDovL3dwYS5xcS5jb20vbXNncmQ/dj0zJnVpbj0yMTA1NTU4NDgmc2l0ZT1xcSZtZW51PXllcyc7XHJcblx0XHQvLyBcdFx0ZXhlYyhgc3RhcnQgJHt1cmx9YCk7XHJcblx0XHQvLyBcdH0pXHJcblx0XHQvLyApO1xyXG5cclxuXHRcdC8vIEkxOG5IZWxwLmFkZEJ1dHRvbihjYiA9PiBjYlxyXG5cdFx0Ly8gXHQuc2V0QnV0dG9uVGV4dCgnUVx1N0ZBNCcpXHJcblx0XHQvLyBcdC5vbkNsaWNrKCgpID0+IHtcclxuXHRcdC8vIFx0XHQvLyBcdTYyNTNcdTVGMDBcdThCRDFcdTY1ODdcdTdGMTZcdThGOTFcdTU2NjhcclxuXHRcdC8vIFx0XHRjb25zdCB1cmwgPSAnaHR0cHM6Ly9xbS5xcS5jb20vY2dpLWJpbi9xbS9xcj9rPTd2RlA4MlpTNHdZWS1TOGZ5a3dUWGFVUFVtY0ZiVE5iJmp1bXBfZnJvbT13ZWJhcGkmYXV0aEtleT1qUUNlSVVnZEpldjhEQm1RSlZySEtVcHE2MGs1ODlXdk5oZU1Hb0tvYTZWYlVkVjdVaExLdEhsVlR6Y3ptRWdGJztcclxuXHRcdC8vIFx0XHRleGVjKGBzdGFydCAke3VybH1gKTtcclxuXHRcdC8vIFx0fSlcclxuXHRcdC8vICk7XHJcblxyXG5cdH1cclxufSIsICJpbXBvcnQgSTE4TiBmcm9tICdzcmMvbWFpbic7XHJcbmltcG9ydCB7IEkxOG5TZXR0aW5nVGFiIH0gZnJvbSAnLic7XHJcbmltcG9ydCB7IEkxOG5TZXR0aW5ncyB9IGZyb20gJy4uL2RhdGEnO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBCYXNlU2V0dGluZyB7XHJcblx0cHJvdGVjdGVkIHNldHRpbmdUYWI6IEkxOG5TZXR0aW5nVGFiO1xyXG5cdHByb3RlY3RlZCBpMThuOiBJMThOO1xyXG5cdHByb3RlY3RlZCBzZXR0aW5nczogSTE4blNldHRpbmdzO1xyXG5cdHByb3RlY3RlZCBjb250YWluZXJFbDogSFRNTEVsZW1lbnQ7XHJcblx0cHJvdGVjdGVkIGFwcDogQXBwO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihvYmo6IEkxOG5TZXR0aW5nVGFiKSB7XHJcblx0XHR0aGlzLnNldHRpbmdUYWIgPSBvYmo7XHJcblx0XHR0aGlzLmkxOG4gPSBvYmouaTE4bjtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBvYmouaTE4bi5zZXR0aW5ncztcclxuXHRcdHRoaXMuY29udGFpbmVyRWwgPSBvYmouY29udGFpbmVyRWw7XHJcblx0XHR0aGlzLmFwcCA9IG9iai5hcHA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWJzdHJhY3QgbWFpbigpOiB2b2lkO1xyXG5cdHB1YmxpYyBkaXNwbGF5KCk6IHZvaWQgeyB0aGlzLm1haW4oKSB9XHJcbn0iLCAiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnXHJcbmltcG9ydCB7IE5vdGljZSwgUGx1Z2luTWFuaWZlc3QgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFN0YXRlIGFzIHN0YXRlLCBUcmFuc2xhdGlvbiB9IGZyb20gJy4vZGF0YS90eXBlcyc7XHJcblxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vICAgICAgICAgICAgXHU3MkI2XHU2MDAxXHU3QkExXHU3NDA2XHU3QzdCXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5leHBvcnQgY2xhc3MgU3RhdGUge1xyXG5cdHBhdGg6IHN0cmluZztcclxuXHRzdGF0ZUpzb246IHN0YXRlID0ge1xyXG5cdFx0J3N0YXRlJzogZmFsc2UsXHJcblx0XHQncGx1Z2luVmVyc2lvbic6ICcnLFxyXG5cdFx0J3RyYW5zbGF0aW9uVmVyc2lvbic6ICcnXHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMucGF0aCA9IHBhdGg7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcdTUyMjRcdTY1QURcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuXHQgKiBAcmV0dXJucyBcdThGRDRcdTU2REVcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuXHQgKi9cclxuXHRwdWJsaWMgaXNTdGF0ZSgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBmcy5wYXRoRXhpc3RzU3luYyh0aGlzLnBhdGgpO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0bmV3IE5vdGljZShgXHUyNkEwICR7ZXJyb3J9YCk7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFx1MjZBMCAke2Vycm9yfWApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gXHU1ODlFXHJcblx0cHVibGljIGluc2VydCgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGZzLm91dHB1dEpzb25TeW5jKHRoaXMucGF0aCwgdGhpcy5zdGF0ZUpzb24pO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0bmV3IE5vdGljZShgXHUyNkEwICR7ZXJyb3J9YCk7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFx1MjZBMCAke2Vycm9yfWApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gXHU1MjIwXHJcblx0cHVibGljIGRlbGV0ZSgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGZzLnJlbW92ZVN5bmModGhpcy5wYXRoKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdG5ldyBOb3RpY2UoYFx1MjZBMCAke2Vycm9yfWApO1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGBcdTI2QTAgJHtlcnJvcn1gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFx1NjUzOVxyXG5cdHB1YmxpYyB1cGRhdGUoaXNfaTE4bjogYm9vbGVhbiwgcGx1Z2luVmVyc2lvbjogc3RyaW5nLCB0cmFuc2xhdGlvblZlcnNpb246IHN0cmluZykge1xyXG5cdFx0Y29uc3Qgc3RhdGU6IHN0YXRlID0ge1xyXG5cdFx0XHQnc3RhdGUnOiBpc19pMThuLFxyXG5cdFx0XHQncGx1Z2luVmVyc2lvbic6IHBsdWdpblZlcnNpb24sXHJcblx0XHRcdCd0cmFuc2xhdGlvblZlcnNpb24nOiB0cmFuc2xhdGlvblZlcnNpb25cclxuXHRcdH1cclxuXHRcdHRyeSB7XHJcblx0XHRcdGZzLm91dHB1dEpzb25TeW5jKHRoaXMucGF0aCwgc3RhdGUpO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0bmV3IE5vdGljZShgXHUyNkEwICR7ZXJyb3J9YCk7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFx1MjZBMCAke2Vycm9yfWApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gXHU2N0U1XHJcblx0cHVibGljIHNlbGVjdCgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBmcy5yZWFkSnNvblN5bmModGhpcy5wYXRoKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdG5ldyBOb3RpY2UoYFx1MjZBMCAke2Vycm9yfWApO1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGBcdTI2QTAgJHtlcnJvcn1gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFtcdTkxQ0RcdTdGNkVdXHJcblx0cHVibGljIHJlc2V0KCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0ZnMub3V0cHV0SnNvblN5bmModGhpcy5wYXRoLCB0aGlzLnN0YXRlSnNvbik7XHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRuZXcgTm90aWNlKGBcdTI2QTAgJHtlcnJvcn1gKTtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihgXHUyNkEwICR7ZXJyb3J9YCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGUoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZWxlY3QoKS5zdGF0ZVxyXG5cdH1cclxuXHJcblx0cHVibGljIHBsdWdpblZlcnNpb24oKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLnNlbGVjdCgpLnBsdWdpblZlcnNpb25cclxuXHR9XHJcblxyXG5cdHB1YmxpYyB0cmFuc2xhdGlvblZlcnNpb24oKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLnNlbGVjdCgpLnRyYW5zbGF0aW9uVmVyc2lvblxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVHJhbnNsYXRpb24oaWQ6IHN0cmluZywgYXV0aG9yOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZywgcGx1Z2luVmVyc2lvbjogc3RyaW5nLCBtYW5pZmVzdEpTT046IFBsdWdpbk1hbmlmZXN0LCBtYWluU3RyOiBzdHJpbmcsIHJlTGVuZ3RoOiBudW1iZXIsIHJlZ2V4cHM6IHN0cmluZ1tdLCBmbGFnczogc3RyaW5nKTogVHJhbnNsYXRpb24ge1xyXG5cdGNvbnN0IGRlc2NyaXB0aW9uID0gbWFuaWZlc3RKU09OLmRlc2NyaXB0aW9uO1xyXG5cdGNvbnN0IHRyYW5zbGF0aW9uSnNvbjogVHJhbnNsYXRpb24gPSB7XHJcblx0XHRcIm1hbmlmZXN0XCI6IHtcclxuXHRcdFx0XCJpZFwiOiBpZCxcclxuXHRcdFx0XCJhdXRob3JcIjogYXV0aG9yID09IFwiXCIgPyBcIlx1NjVFMFx1NTQwRFx1NkMwRlwiIDogYXV0aG9yLFxyXG5cdFx0XHRcInZlcnNpb25cIjogdmVyc2lvbixcclxuXHRcdFx0XCJwbHVnaW5WZXJzaW9uXCI6IHBsdWdpblZlcnNpb25cclxuXHRcdH0sXHJcblx0XHRcImRlc2NyaXB0aW9uXCI6IHtcclxuXHRcdFx0XCJvcmlnaW5hbFwiOiBkZXNjcmlwdGlvbixcclxuXHRcdFx0XCJ0cmFuc2xhdGlvblwiOiBkZXNjcmlwdGlvblxyXG5cdFx0fSxcclxuXHRcdFwiZGljdFwiOiB7fVxyXG5cdH1cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHJlZ2V4cHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IHRlbXBfYXJyYXkgPSBtYWluU3RyLm1hdGNoKG5ldyBSZWdFeHAocmVnZXhwc1tpXSwgZmxhZ3MpKTtcclxuXHRcdGlmICh0ZW1wX2FycmF5ICE9IG51bGwpXHJcblx0XHRcdGZvciAoY29uc3QgaSBpbiB0ZW1wX2FycmF5KVxyXG5cdFx0XHRcdGlmICh0ZW1wX2FycmF5W2ldLmxlbmd0aCA8PSByZUxlbmd0aClcclxuXHRcdFx0XHRcdHRyYW5zbGF0aW9uSnNvbi5kaWN0W3RlbXBfYXJyYXlbaV1dID0gdGVtcF9hcnJheVtpXVxyXG5cdH1cclxuXHRyZXR1cm4gdHJhbnNsYXRpb25Kc29uXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBQTm90aWNlKHByZWZpeDogc3RyaW5nLCB0ZXh0OiBhbnkpIHtcclxuXHRuZXcgTm90aWNlKGBbJHtwcmVmaXh9XSAke3RleHR9YCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOb3RpY2VTdWNjZXNzKHByZWZpeDogc3RyaW5nLCB0ZXh0OiBhbnksIGR1cmF0aW9uID0gNDAwMCkge1xyXG5cdGNvbnN0IGhhc0NsYXNzID0gZG9jdW1lbnQuYm9keSA/IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aGVtZS1kYXJrJykgOiBmYWxzZTtcclxuXHRuZXcgTm90aWNlKGBbJHtwcmVmaXh9XSAke3RleHR9YCwgZHVyYXRpb24pLm5vdGljZUVsLmFkZENsYXNzKGBpMThuX25vdGljZV8ke2hhc0NsYXNzID8gJ2RhcmsnIDogJ2xpZ2h0J31fc3VjY2Vzc2ApO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBOb3RpY2VJbmZvKHByZWZpeDogc3RyaW5nLCB0ZXh0OiBhbnksIGR1cmF0aW9uID0gNDAwMCkge1xyXG5cdGNvbnN0IGhhc0NsYXNzID0gZG9jdW1lbnQuYm9keSA/IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aGVtZS1kYXJrJykgOiBmYWxzZTtcclxuXHRuZXcgTm90aWNlKGBbJHtwcmVmaXh9XSAke3RleHR9YCwgZHVyYXRpb24pLm5vdGljZUVsLmFkZENsYXNzKGBpMThuX25vdGljZV8ke2hhc0NsYXNzID8gJ2RhcmsnIDogJ2xpZ2h0J31faW5mb2ApO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBOb3RpY2VXYXJuaW5nKHByZWZpeDogc3RyaW5nLCB0ZXh0OiBhbnksIGR1cmF0aW9uID0gNDAwMCkge1xyXG5cdGNvbnN0IGhhc0NsYXNzID0gZG9jdW1lbnQuYm9keSA/IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aGVtZS1kYXJrJykgOiBmYWxzZTtcclxuXHRuZXcgTm90aWNlKGBbJHtwcmVmaXh9XSAke3RleHR9YCwgZHVyYXRpb24pLm5vdGljZUVsLmFkZENsYXNzKGBpMThuX25vdGljZV8ke2hhc0NsYXNzID8gJ2RhcmsnIDogJ2xpZ2h0J31fd2FybmluZ2ApO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBOb3RpY2VFcnJvcihwcmVmaXg6IHN0cmluZywgdGV4dDogYW55LCBkdXJhdGlvbiA9IDEwMDAwKSB7XHJcblx0Y29uc3QgaGFzQ2xhc3MgPSBkb2N1bWVudC5ib2R5ID8gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3RoZW1lLWRhcmsnKSA6IGZhbHNlO1xyXG5cdG5ldyBOb3RpY2UoYFske3ByZWZpeH1dICR7dGV4dH1gLCBkdXJhdGlvbikubm90aWNlRWwuYWRkQ2xhc3MoYGkxOG5fbm90aWNlXyR7aGFzQ2xhc3MgPyAnZGFyaycgOiAnbGlnaHQnfV9lcnJvcmApO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBOb3RpY2VPcGVyYXRpb25SZXN1bHQocHJlZml4OiBzdHJpbmcsIGlzU3VjY2VzczogYm9vbGVhbiwgdGV4dDogYW55ID0gXCJcIikge1xyXG5cdGNvbnN0IGhhc0NsYXNzID0gZG9jdW1lbnQuYm9keSA/IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aGVtZS1kYXJrJykgOiBmYWxzZTtcclxuXHRpZiAoaXNTdWNjZXNzKSB7XHJcblx0XHRpZiAodGV4dCAhPSBcIlwiKSB7IG5ldyBOb3RpY2UoYFske3ByZWZpeH1dIFx1NjIxMFx1NTI5RlxcbiR7dGV4dH1gLCA0MDAwKS5ub3RpY2VFbC5hZGRDbGFzcyhgaTE4bl9ub3RpY2VfJHtoYXNDbGFzcyA/ICdkYXJrJyA6ICdsaWdodCd9X3N1Y2Nlc3NgKTsgfVxyXG5cdFx0ZWxzZSB7IG5ldyBOb3RpY2UoYFske3ByZWZpeH1dIFx1NjIxMFx1NTI5RmAsIDQwMDApLm5vdGljZUVsLmFkZENsYXNzKGBpMThuX25vdGljZV8ke2hhc0NsYXNzID8gJ2RhcmsnIDogJ2xpZ2h0J31fc3VjY2Vzc2ApOyB9XHJcblx0fSBlbHNlIHtcclxuXHRcdG5ldyBOb3RpY2UoYFske3ByZWZpeH1dIFx1NTkzMVx1OEQyNVxcbiR7dGV4dH1gLCAxMDAwMCkubm90aWNlRWwuYWRkQ2xhc3MoYGkxOG5fbm90aWNlXyR7aGFzQ2xhc3MgPyAnZGFyaycgOiAnbGlnaHQnfV9lcnJvcmApO1xyXG5cdH1cclxufVxyXG5cclxuLy8gaW1wb3J0IHsgZXhlYywgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxuLy8gXHU5MDA5XHU2MkU5XHU3NkVFXHU1RjU1XHJcbi8vIGNvbnN0IGNvbW1hbmQgPSBgcG93ZXJzaGVsbC5leGUgLUNvbW1hbmQgXCImIHtBZGQtVHlwZSAtQXNzZW1ibHlOYW1lIFN5c3RlbS5XaW5kb3dzLkZvcm1zOyAkZm9sZGVyRGlhbG9nID0gTmV3LU9iamVjdCBTeXN0ZW0uV2luZG93cy5Gb3Jtcy5Gb2xkZXJCcm93c2VyRGlhbG9nOyAkZm9sZGVyRGlhbG9nLkRlc2NyaXB0aW9uID0gJ1x1OEJGN1x1OTAwOVx1NjJFOVx1NjU4N1x1NEVGNlx1NTkzOSc7ICRmb2xkZXJEaWFsb2cuUm9vdEZvbGRlciA9IFtTeXN0ZW0uRW52aXJvbm1lbnQrU3BlY2lhbEZvbGRlcl06Ok15Q29tcHV0ZXI7ICRyZXN1bHQgPSAkZm9sZGVyRGlhbG9nLlNob3dEaWFsb2coKTsgaWYgKCRyZXN1bHQgLWVxIFtTeXN0ZW0uV2luZG93cy5Gb3Jtcy5EaWFsb2dSZXN1bHRdOjpPSykgeyBXcml0ZS1PdXRwdXQgJGZvbGRlckRpYWxvZy5TZWxlY3RlZFBhdGggfSBlbHNlIHsgV3JpdGUtT3V0cHV0ICcnIH19XCJgXHJcbi8vIFx1NjI1M1x1NUYwMFx1NjMwN1x1NUI5QVx1NzZFRVx1NUY1NVxyXG4vLyBjb25zdCBjb21tYW5kID0gYHBvd2Vyc2hlbGwuZXhlIC1Db21tYW5kIFwiaWkgRDpcXFxcR2FtZVxcXFxTdGVhbVwiYFxyXG4vLyBpaSAvXHJcbi8vIFx1NUYwMlx1NkI2NVx1NjI2N1x1ODg0Q1xyXG4vLyBleGVjKGNvbW1hbmQsIChlcnJvciwgZmlsZSkgPT4ge1xyXG4vLyBcdGNvbnNvbGUubG9nKGVycm9yLCBmaWxlLnRvU3RyaW5nKCkpXHJcbi8vIH0pXHJcblxyXG4vLyBcdTU0MENcdTZCNjVcdTYyNjdcdTg4NENcclxuLy8gY29uc3QgZmlsZVBhdGggPSBleGVjU3luYyhjb21tYW5kKVxyXG4vLyBjb25zb2xlLmxvZygnXHU5MDA5XHU2MkU5XHU3Njg0XHU2NTg3XHU0RUY2JywgZmlsZVBhdGgpXHJcbiIsICJleHBvcnQgZGVmYXVsdCBjbGFzcyBVcmwge1xyXG4gICAgcHVibGljIHN0YXRpYyBJMThOX0lDT04gPSBcImh0dHBzOi8vZ2l0ZWUuY29tL3plcm8tLXR3by9vYnNpZGlhbi1pMThuLXRyYW5zbGF0aW9uL3Jhdy9tYXN0ZXIvT2JzaWRpYW4ucG5nXCJcclxuICAgIHB1YmxpYyBzdGF0aWMgUVFfR1JPVVAgPSBcImh0dHBzOi8vcW0ucXEuY29tL2NnaS1iaW4vcW0vcXI/az1rSFRTMGlDMUZDNWlnVFhiZGJLemZmNl90YzU0bU9GNSZqdW1wX2Zyb209d2ViYXBpJmF1dGhLZXk9QW9Ta3JpVytuRGVEekJQcUJsOWpjcGJBWWtQWE4yUVJick1oMGhGYnZNckdicVp5UkFiSndhRDZKS2JPeTROeFwiO1xyXG4gICAgcHVibGljIHN0YXRpYyBWSURFT19UVVRPUklBTCA9IFwiaHR0cHM6Ly93d3cuYmlsaWJpbGkuY29tL3ZpZGVvL0JWMWM4cHZlU0VoQy8/c3BtX2lkX2Zyb209MzMzLjc4OCZ2ZF9zb3VyY2U9MmM5N2MxNDczMTc2Yjk0MmMwZWQ1ZmZlOWNiYjA1YjFcIlxyXG4gICAgcHVibGljIHN0YXRpYyBET0NVTUVOVEFUSU9OX1RVVE9SSUFMID0gXCJodHRwczovL2dpdGh1Yi5jb20vMDAxMTAwMDAwMDExMDAxMC9vYnNpZGlhbi1pMThuL3dpa2kvJUU1JTlGJUJBJUU3JUExJTgwJUU2JTkzJThEJUU0JUJEJTlDXCJcclxuXHJcbn0gICIsICJpbXBvcnQgeyBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBCYXNlU2V0dGluZyBmcm9tIFwiLi9iYXNlLXNldHRpbmdcIjtcclxuaW1wb3J0IHsgTEFOR1VBR0VTIH0gZnJvbSBcInNyYy9kYXRhL2RhdGFcIjtcclxuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9pbnhkZXhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEkxOG5MYW5ndWFnZSBleHRlbmRzIEJhc2VTZXR0aW5nIHtcclxuICAgIG1haW4oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaTE4bkxhbmd1YWdlID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCk7XHJcbiAgICAgICAgaTE4bkxhbmd1YWdlLnNldE5hbWUodCgnU0VUVElOR19MQU5HVUFHRScpKTtcclxuICAgICAgICBpMThuTGFuZ3VhZ2Uuc2V0RGVzYyh0KCdTRVRUSU5HX0xBTkdVQUdFX0RFU0MnKSk7XHJcbiAgICAgICAgaTE4bkxhbmd1YWdlLmFkZERyb3Bkb3duKGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5hZGRPcHRpb25zKExBTkdVQUdFUylcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9MQU5HVUFHRSlcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX0xBTkdVQUdFID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyBBcGlUeXBlcywgQmFpZHVFcnJvckNvZGUsIExhbmd1YWdlcyB9IGZyb20gXCIuL3R5cGVzXCJcclxuXHJcbmV4cG9ydCBjb25zdCBMQU5HVUFHRVM6IExhbmd1YWdlcyA9IHtcclxuICAgIFwiemgtY25cIjogXCJcdTdCODBcdTRGNTNcdTRFMkRcdTY1ODdcIixcclxuICAgIFwiemgtdHdcIjogXCJcdTdFNDFcdTlBRDRcdTRFMkRcdTY1ODdcIixcclxuICAgIFwiZW5cIjogXCJFbmdsaXNoXCIsXHJcbiAgICBcInJ1XCI6IFwiXHUwNDIwXHUwNDQzXHUwNDQxXHUwNDQxXHUwNDNBXHUwNDM4XHUwNDM5XCIsXHJcbiAgICAnY3VzdG9tICc6IFwiXHU4MUVBXHU1QjlBXHU0RTQ5XCJcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEFQSV9UWVBFUzogQXBpVHlwZXMgPSB7XHJcbiAgICAnQkFJRFUnOiAnXHU3NjdFXHU1RUE2JyxcclxuICAgICdPUEVOQUknOiAnT3BlbkFJJ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQkFJRFVfRVJST1JfQ09ERTogQmFpZHVFcnJvckNvZGUgPSB7XHJcbiAgICBcIjUyMDAwXCI6IFwiXHU2MjEwXHU1MjlGXCIsXHJcbiAgICBcIjUyMDAxXCI6IFwiXHU4QkY3XHU2QzQyXHU4RDg1XHU2NUY2XCIsXHJcbiAgICBcIjUyMDAyXCI6IFwiXHU3Q0ZCXHU3RURGXHU5NTE5XHU4QkVGXCIsXHJcbiAgICBcIjUyMDAzXCI6IFwiXHU2NzJBXHU2Mzg4XHU2NzQzXHU3NTI4XHU2MjM3XCIsXHJcbiAgICBcIjU0MDAwXCI6IFwiXHU1RkM1XHU1ODZCXHU1M0MyXHU2NTcwXHU0RTNBXHU3QTdBXCIsXHJcbiAgICBcIjU0MDAxXCI6IFwiXHU3QjdFXHU1NDBEXHU5NTE5XHU4QkVGXCIsXHJcbiAgICBcIjU0MDAzXCI6IFwiXHU4QkJGXHU5NUVFXHU5ODkxXHU3Mzg3XHU1M0Q3XHU5NjUwXCIsXHJcbiAgICBcIjU0MDA0XCI6IFwiXHU4RDI2XHU2MjM3XHU0RjU5XHU5ODlEXHU0RTBEXHU4REIzXCIsXHJcbiAgICBcIjU0MDA1XCI6IFwiXHU5NTdGcXVlcnlcdThCRjdcdTZDNDJcdTk4OTFcdTdFNDFcIixcclxuICAgIFwiNTgwMDBcIjogXCJcdTVCQTJcdTYyMzdcdTdBRUZJUFx1OTc1RVx1NkNENVwiLFxyXG4gICAgXCI1ODAwMVwiOiBcIlx1OEJEMVx1NjU4N1x1OEJFRFx1OEEwMFx1NjVCOVx1NTQxMVx1NEUwRFx1NjUyRlx1NjMwMVwiLFxyXG4gICAgXCI1ODAwMlwiOiBcIlx1NjcwRFx1NTJBMVx1NUY1M1x1NTI0RFx1NURGMlx1NTE3M1x1OTVFRFwiLFxyXG4gICAgXCI1ODAwM1wiOiBcIlx1NkI2NElQXHU1REYyXHU4OEFCXHU1QzAxXHU3OTgxXCIsXHJcbiAgICBcIjkwMTA3XCI6IFwiXHU4QkE0XHU4QkMxXHU2NzJBXHU5MDFBXHU4RkM3XHU2MjE2XHU2NzJBXHU3NTFGXHU2NTQ4XCIsXHJcbiAgICBcIjIwMDAzXCI6IFwiXHU4QkY3XHU2QzQyXHU1MTg1XHU1QkI5XHU1QjU4XHU1NzI4XHU1Qjg5XHU1MTY4XHU5OENFXHU5NjY5IFwiXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBJMThOX1NPUlQgPSB7XHJcbiAgICAnMCc6ICdcdTZCNjNcdTVFOEYnLFxyXG4gICAgJzEnOiAnXHU1MDEyXHU1RThGJ1xyXG59XHJcbmV4cG9ydCBjb25zdCBJMThOX1RZUEUgPSB7XHJcbiAgICAnMCc6ICdcdTUxNjhcdTkwRTgnLFxyXG4gICAgJzEnOiAnXHU2M0QwXHU1M0Q2JyxcclxuICAgICcyJzogJ1x1N0ZGQlx1OEJEMScsXHJcbiAgICAnMyc6ICdcdThGRDhcdTUzOUYnXHJcbn0iLCAiaW1wb3J0IHsgbW9tZW50IH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB6aF9jbiBmcm9tICcuL2xvY2FsZS96aC1jbic7XHJcblxyXG4vLyBvYnNpZGlhbi1leGNhbGlkcmF3LXBsdWdpblxyXG5jb25zdCBsb2NhbGVNYXA6IHsgW2s6IHN0cmluZ106IFBhcnRpYWw8dHlwZW9mIHpoX2NuPiB9ID0ge1xyXG4gICd6aC1jbic6IHpoX2NuLFxyXG4gIC8vICd6aC10dyc6ICxcclxuICAvLyAnZW4tZ2InOiAsXHJcbn07XHJcblxyXG5jb25zdCBsb2NhbGUgPSBsb2NhbGVNYXBbbW9tZW50LmxvY2FsZSgpXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0KHN0cjoga2V5b2YgdHlwZW9mIHpoX2NuKTogc3RyaW5nIHtcclxuICByZXR1cm4gKGxvY2FsZSAmJiBsb2NhbGVbc3RyXSkgfHwgemhfY25bc3RyXTtcclxufVxyXG4iLCAiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgTEFOR1VBR0U6ICdcdThCRURcdThBMDAnLFxyXG4gICAgSTE4Tl9SSUJCT05fVElUTEU6ICdcdTYzRDJcdTRFRjZcdTUyMTdcdTg4NjgnLFxyXG4gICAgSTE4Tl9WRVJTSU9OX1RJVExFOiAnXHU3MjQ4XHU2NzJDJyxcclxuICAgIEJBVENIX1RJVExFOiAnXHU2Mjc5XHU5MUNGJyxcclxuICAgIEJBVENIX1RSRU5TTEFUT1JfVEVYVDogJ1x1N0ZGQlx1OEJEMScsXHJcbiAgICBCQVRDSF9UUkVOU0xBVE9SX1RPT0xUSVA6ICdcdTYyNzlcdTkxQ0ZcdTdGRkJcdThCRDFcdTYzRDJcdTRFRjYnLFxyXG4gICAgQkFUQ0hfVFJFTlNMQVRPUl9OUFRJQ0U6ICdcdTdGRkJcdThCRDFcdTVCOENcdTYyMTAnLFxyXG4gICAgQkFUQ0hfVFJFTlNMQVRPUl9OUFRJQ0VfMjogJ1tcdTYyNzlcdTkxQ0ZcdTdGRkJcdThCRDFdIFx1OTFDRFx1NTQyRiBPYnNpZGlhbiBcdTc1MUZcdTY1NDgnLFxyXG5cclxuICAgIEJBVENIX1JFU1RPUkVfVEVYVDogJ1x1OEZEOFx1NTM5RicsXHJcbiAgICBCQVRDSF9SRVNUT1JFX1RPT0xUSVA6ICdcdTYyNzlcdTkxQ0ZcdThGRDhcdTUzOUZcdTYzRDJcdTRFRjYnLFxyXG4gICAgQkFUQ0hfUkVTVE9SRV9OUFRJQ0U6ICdcdThGRDhcdTUzOUZcdTVCOENcdTYyMTAnLFxyXG4gICAgQkFUQ0hfUkVTVE9SRV9OUFRJQ0VfMjogJ1tcdTYyNzlcdTkxQ0ZcdThGRDhcdTUzOUZdIFx1OTFDRFx1NTQyRiBPYnNpZGlhbiBcdTc1MUZcdTY1NDgnLFxyXG5cclxuICAgIEJBVENIX0dFTkVSQVRFX1RFWFQ6ICdcdTc1MUZcdTYyMTAnLFxyXG4gICAgQkFUQ0hfR0VORVJBVEVfVE9PTFRJUDogJ1x1NjI3OVx1OTFDRlx1NzUxRlx1NjIxMFx1NjNEMlx1NEVGNlx1OEJEMVx1NjU4NycsXHJcbiAgICBCQVRDSF9HRU5FUkFURV9OUFRJQ0U6ICdcdTc1MUZcdTYyMTBcdTVCOENcdTYyMTAnLFxyXG4gICAgQkFUQ0hfR0VORVJBVEVfTlBUSUNFXzI6ICdbXHU2Mjc5XHU5MUNGXHU3NTFGXHU2MjEwXSBcdTc1MUZcdTYyMTBcdTVCOENcdTYyMTAgXHU4QkY3XHU1MjREXHU1RjgwXHU2M0QyXHU0RUY2XHU3NkVFXHU1RjU1XHU4RkRCXHU4ODRDXHU2MjRCXHU1MkE4XHU3RkZCXHU4QkQxXHU1REU1XHU0RjVDJyxcclxuXHJcbiAgICBCQVRDSF9ERUxFVEVfVEVYVDogJ1x1NTIyMFx1OTY2NCcsXHJcbiAgICBCQVRDSF9ERUxFVEVfVE9PTFRJUDogJ1x1NjI3OVx1OTFDRlx1NTIyMFx1OTY2NFx1NjNEMlx1NEVGNlx1OEJEMVx1NjU4NycsXHJcbiAgICBCQVRDSF9ERUxFVEVfTlBUSUNFOiAnXHU1MjIwXHU5NjY0XHU1QjhDXHU2MjEwJyxcclxuICAgIEJBVENIX0RFTEVURV9OUFRJQ0VfMjogJ1tcdTYyNzlcdTkxQ0ZcdTUyMjBcdTk2NjRdIFx1OTFDRFx1NTQyRiBPYnNpZGlhbiBcdTc1MUZcdTY1NDgnLFxyXG5cclxuICAgIE9QRU5fUExVR0lORElSX1RPT0xUSVA6ICdcdTYyNTNcdTVGMDBcdTYzRDJcdTRFRjZcdTc2RUVcdTVGNTUnLFxyXG4gICAgREVMRVRFX1BMVUdJTkRJUl9URVhUOiAnXHU1MjIwXHU5NjY0JyxcclxuICAgIERFTEVURV9QTFVHSU5ESVJfVE9PTFRJUDogJ1x1NkUwNVx1OTY2NFx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNicsXHJcbiAgICBERUxFVEVfUExVR0lORElSX05QVElDRTogJ1x1NTIyMFx1OTY2NFx1NUI4Q1x1NjIxMCcsXHJcbiAgICBERUxFVEVfUExVR0lORElSX05QVElDRV8yOiAnXHU5MUNEXHU1NDJGIE9ic2lkaWFuIFx1NzUxRlx1NjU0OCcsXHJcbiAgICBMRFRfR0VORVJBVEVfVEVYVDogJ1x1NzUxRlx1NjIxMCcsXHJcbiAgICBMRFRfR0VORVJBVEVfVE9PTFRJUDogJ1x1NzUxRlx1NjIxMFx1NjcyQVx1N0ZGQlx1OEJEMVx1OEJEMVx1NjU4NycsXHJcbiAgICBMRFRfR0VORVJBVEVfTlBUSUNFOiAnXHU3NTFGXHU2MjEwXHU1QjhDXHU2MjEwIFx1OEJGN1x1NTI0RFx1NUY4MFx1NjNEMlx1NEVGNlx1NzZFRVx1NUY1NVx1OEZEQlx1ODg0Q1x1NjI0Qlx1NTJBOFx1N0ZGQlx1OEJEMVx1NURFNVx1NEY1QycsXHJcbiAgICBORFRfRE9XTkxPQURfVEVYVDogJ1x1NEUwQlx1OEY3RCcsXHJcbiAgICBORFRfRE9XTkxPQURfVE9PTFRJUDogJ1x1NEVDRVx1N0Y1MVx1N0VEQ1x1NEUwQlx1OEY3RFx1OEJEMVx1NjU4NycsXHJcbiAgICBORFRfVVBEQVRFX1RFWFQ6ICdcdTY2RjRcdTY1QjAnLFxyXG4gICAgTkRUX1VQREFURV9UT09MVElQOiAnXHU1QkY5XHU2NzJDXHU1NzMwXHU4QkQxXHU2NTg3XHU4RkRCXHU4ODRDXHU2NkY0XHU2NUIwJyxcclxuICAgIE5JVF9HRU5FUkFURV9URVhUOiAnXHU3NTFGXHU2MjEwJyxcclxuICAgIE5JVF9HRU5FUkFURV9UT09MVElQOiAnXHU3NTFGXHU2MjEwXHU1REYyXHU3RkZCXHU4QkQxXHU4QkQxXHU2NTg3JyxcclxuICAgIE5JVF9HRU5FUkFURV9OUFRJQ0U6ICdcdTc1MUZcdTYyMTBcdTRFMkQnLFxyXG4gICAgVFJBTlNMQVRFX1RFWFQ6ICdcdTdGRkJcdThCRDEnLFxyXG4gICAgVFJBTlNMQVRFX1RPT0xUSVA6ICdcdTVCRjlcdTYzRDJcdTRFRjZcdThGREJcdTg4NENcdTdGRkJcdThCRDEnLFxyXG4gICAgVFJBTlNMQVRFX05QVElDRTogJ1x1OTFDRFx1NTQyRiBPYnNpZGlhbiBcdTc1MUZcdTY1NDgnLFxyXG4gICAgUkVTVE9SRV9URVhUOiAnXHU4RkQ4XHU1MzlGJyxcclxuICAgIFJFU1RPUkVfVE9PTFRJUDogJ1x1NUJGOVx1NjNEMlx1NEVGNlx1OEZEQlx1ODg0Q1x1OEZEOFx1NTM5RicsXHJcbiAgICBSRVNUT1JFX05QVElDRTogJ1x1OTFDRFx1NTQyRiBPYnNpZGlhbiBcdTc1MUZcdTY1NDgnLFxyXG4gICAgUkVTVE9SRV9OUFRJQ0VfMjogJ1x1OEZEOFx1NTM5Rlx1NUI4Q1x1NjIxMCcsXHJcblxyXG4gICAgU0VUVElOR19CQVNFX1RJVExFOiAnXHU1N0ZBXHU3ODQwXHU4QkJFXHU3RjZFJyxcclxuICAgIFNFVFRJTkdfTEFOR1VBR0U6ICdcdThCRURcdThBMDAnLFxyXG4gICAgU0VUVElOR19MQU5HVUFHRV9ERVNDOiAnXHU5MDA5XHU2MkU5XHU5NzAwXHU4OTgxXHU3RkZCXHU4QkQxXHU3Njg0XHU4QkVEXHU4QTAwJyxcclxuICAgIFNFVFRJTkdfTE9HOiAnXHU2NUU1XHU1RkQ3JyxcclxuICAgIFNFVFRJTkdfTE9HX0RFU0M6ICdcdTY2MkZcdTU0MjZcdTVGMDBcdTU0MkZcdTY1RTVcdTVGRDdcdThDMDNcdThCRDUoQ3RybCArIFNoaWZ0ICsgSSknLFxyXG4gICAgU0VUVElOR19CQVRDSDogJ1x1NjI3OVx1OTFDRicsXHJcbiAgICBTRVRUSU5HX0JBVENIX0RFU0M6ICdcdTY2MkZcdTU0MjZcdTVGMDBcdTU0MkZcdTYyNzlcdTkxQ0ZcdTY0Q0RcdTRGNUMnLFxyXG5cclxuICAgIFNFVFRJTkdfTERUX1RJVExFOiAnXHU2NzJDXHU1NzMwXHU2NTg3XHU0RUY2XHU2QTIxXHU1RjBGJyxcclxuICAgIFNFVFRJTkdfTERUX01PREU6ICdcdTZBMjFcdTVGMEYnLFxyXG4gICAgU0VUVElOR19MRFRfTU9ERV9ERVNDOiAnXHU1RjAwXHU1NDJGXHU2NzJDXHU1NzMwXHU2NTg3XHU0RUY2XHU2QTIxXHU1RjBGIFx1NUMwNlx1NEYxQVx1NUYwMFx1NTQyRlx1N0ZGQlx1OEJEMVx1OEZEOFx1NTM5Rlx1NzUxRlx1NjIxMFx1NTI5Rlx1ODBGRCcsXHJcbiAgICBTRVRUSU5HX0xEVF9HRU5FUkFURTogJ1x1NzUxRlx1NjIxMCcsXHJcbiAgICBTRVRUSU5HX0xEVF9HRU5FUkFURV9ERVNDOiAnXHU1RjAwXHU1NDJGXHU2NzJDXHU1NzMwXHU4QkQxXHU2NTg3XHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU1MjlGXHU4MEZEJyxcclxuXHJcbiAgICBTRVRUSU5HX05EVF9USVRMRTogJ1x1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNlx1NkEyMVx1NUYwRicsXHJcbiAgICBTRVRUSU5HX05EVF9NT0RFOiAnXHU2QTIxXHU1RjBGJyxcclxuICAgIFNFVFRJTkdfTkRUX01PREVfREVTQzogJ1x1NUYwMFx1NTQyRlx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNlx1NkEyMVx1NUYwRiBcdTVDMDZcdTRGMUFcdTRFQ0VcdTdGNTFcdTdFRENcdTRFMEJcdThGN0RcdThCRDFcdTY1ODcnLFxyXG4gICAgU0VUVElOR19ORFRfQVBJUzogJ1x1NjNBNVx1NTNFMycsXHJcbiAgICBTRVRUSU5HX05EVF9BUElTX0RFU0M6ICdcdThCRjdcdThGOTNcdTUxNjVcdTYwQThcdTg5ODFcdTdGRkJcdThCRDFcdThCRURcdThBMDBcdTVCRjlcdTVFOTRcdTc2ODRBUEkoXHU5MUNEXHU2NUIwXHU2REZCXHU1MkEwXHU1QzA2XHU0RjFBXHU4OTg2XHU3NkQ2KScsXHJcbiAgICBTRVRUSU5HX05EVF9BUElfQUREOiAnXHU2REZCXHU1MkEwJyxcclxuICAgIFNFVFRJTkdfTkRUX05QVElDRTogJ1tcdTdGNTFcdTdFRENcdThCRDFcdTY1ODdcdTZBMjFcdTVGMEZdIFx1NUY1M1x1NTI0RFx1OEJFRFx1OEEwMCBBUEkgXHU0RTBEXHU1QjU4XHU1NzI4JyxcclxuXHJcbiAgICBTRVRUSU5HX05JVF9USVRMRTogJ1x1N0Y1MVx1N0VEQ1x1NjNBNVx1NTNFM1x1NkEyMVx1NUYwRicsXHJcbiAgICBTRVRUSU5HX05JVF9NT0RFOiAnXHU2QTIxXHU1RjBGJyxcclxuICAgIFNFVFRJTkdfTklUX01PREVfREVTQzogJ1x1NUYwMFx1NTQyRlx1N0Y1MVx1N0VEQ1x1NjNBNVx1NTNFM1x1NkEyMVx1NUYwRiBcdTVDMDZcdTRGMUFcdTRFQ0VcdTdGNTFcdTdFRENBUElcdTdGRkJcdThCRDFcdTY1ODdcdTY3MkMnLFxyXG4gICAgU0VUVElOR19OSVRfQVBJUzogJ1x1NjNBNVx1NTNFMycsXHJcbiAgICBTRVRUSU5HX05JVF9BUElTX0RFU0M6ICdcdTkwMDlcdTYyRTlcdTYwQThcdTg5ODFcdTRGN0ZcdTc1MjhcdTc2ODRcdTYzQTVcdTUzRTMnLFxyXG4gICAgU0VUVElOR19OSVRfQkFJRFU6ICdcdTc2N0VcdTVFQTYnLFxyXG4gICAgU0VUVElOR19OSVRfQkFJRFVfREVTQzogJ1x1NTdGQVx1NEU4RVx1NzY3RVx1NUVBNkFQSVx1OEZEQlx1ODg0Q1x1N0ZGQlx1OEJEMScsXHJcbn0iLCAiaW1wb3J0IHsgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgQmFzZVNldHRpbmcgZnJvbSBcIi4vYmFzZS1zZXR0aW5nXCI7XHJcblxyXG4vLyBcdTgxRUFcdTUyQThcdTY2RjRcdTY1QjBcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSTE4bk1vZExEVCBleHRlbmRzIEJhc2VTZXR0aW5nIHtcclxuICAgIG1haW4oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaTE4bk1vZExEVCA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIGkxOG5Nb2RMRFQuc2V0Q2xhc3MoJ2JvbGQnKTtcclxuICAgICAgICBpMThuTW9kTERULnNldE5hbWUoXCJcdTY3MkNcdTU3MzBcdTY1ODdcdTRFRjZcdTZBMjFcdTVGMEZcIik7XHJcbiAgICAgICAgaTE4bk1vZExEVC5zZXREZXNjKFwiXCIpO1xyXG4gICAgICAgIGkxOG5Nb2RMRFQuYWRkVG9nZ2xlKGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9MRFQpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9MRFQgPSAhdGhpcy5zZXR0aW5ncy5JMThOX01PREVfTERUO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nVGFiLmRpc3BsYXkoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwgImltcG9ydCB7IFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IEJhc2VTZXR0aW5nIGZyb20gXCIuL2Jhc2Utc2V0dGluZ1wiO1xyXG5cclxuLy8gXHU4MUVBXHU1MkE4XHU2NkY0XHU2NUIwXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEkxOG5Nb2RORFQgZXh0ZW5kcyBCYXNlU2V0dGluZyB7XHJcbiAgICBtYWluKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGkxOG5Nb2RORFQgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICBpMThuTW9kTkRULnNldENsYXNzKCdib2xkJyk7XHJcbiAgICAgICAgaTE4bk1vZE5EVC5zZXROYW1lKFwiXHU0RTkxXHU3QUVGXHU2NTg3XHU0RUY2XHU2QTIxXHU1RjBGXCIpO1xyXG4gICAgICAgIGkxOG5Nb2RORFQuc2V0RGVzYyhcIlwiKTtcclxuICAgICAgICBpMThuTW9kTkRULmFkZFRvZ2dsZShjYiA9PiBjYlxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX01PREVfTkRUKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX01PREVfTkRUID0gIXRoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFX05EVDtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5pMThuLm1hbmlmZXN0LmlkO1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLmFwcC5zZXR0aW5nO1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAucGx1Z2lucy5kaXNhYmxlUGx1Z2luKGlkKTtcclxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnBsdWdpbnMuZW5hYmxlUGx1Z2luKGlkKTtcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBCYXNlU2V0dGluZyBmcm9tIFwiLi9iYXNlLXNldHRpbmdcIjtcclxuaW1wb3J0IHsgTEFOR1VBR0VTIH0gZnJvbSAnc3JjL2RhdGEvZGF0YSdcclxuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9pbnhkZXhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEkxOG5OZHRBcGkgZXh0ZW5kcyBCYXNlU2V0dGluZyB7XHJcblx0bWFpbigpOiB2b2lkIHtcclxuXHRcdGxldCB0ZW1wX25kdF9sYW5nID0gJyc7XHJcblx0XHRsZXQgdGVtcF9uZHRfdXJsID0gJyc7XHJcblx0XHRjb25zdCBpMThuTmR0QXBpcyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG5cdFx0aWYgKCEodGhpcy5zZXR0aW5ncy5JMThOX01PREVfTkRUKSkgaTE4bk5kdEFwaXMuc2V0Q2xhc3MoJ2kxOG5fZGlzcGxheS1ub25lJyk7XHJcblx0XHRpMThuTmR0QXBpcy5zZXROYW1lKHQoJ1NFVFRJTkdfTkRUX0FQSVMnKSk7XHJcblx0XHRpMThuTmR0QXBpcy5zZXREZXNjKHQoJ1NFVFRJTkdfTkRUX0FQSVNfREVTQycpKTtcclxuXHRcdGkxOG5OZHRBcGlzLmFkZERyb3Bkb3duKGNiID0+IGNiXHJcblx0XHRcdC5hZGRPcHRpb25zKExBTkdVQUdFUylcclxuXHRcdFx0LnNldFZhbHVlKCcnKVxyXG5cdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0dGVtcF9uZHRfbGFuZyA9IHZhbHVlO1xyXG5cdFx0XHR9KVxyXG5cdFx0KTtcclxuXHRcdGkxOG5OZHRBcGlzLmFkZFRleHQoY2IgPT4gY2JcclxuXHRcdFx0LnNldFBsYWNlaG9sZGVyKCdVUkwnKVxyXG5cdFx0XHQub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0dGVtcF9uZHRfdXJsID0gdmFsdWVcclxuXHRcdFx0fSlcclxuXHRcdCk7XHJcblx0XHRpMThuTmR0QXBpcy5hZGRCdXR0b24oY2IgPT4gY2JcclxuXHRcdFx0LnNldEJ1dHRvblRleHQodCgnU0VUVElOR19ORFRfQVBJX0FERCcpKVxyXG5cdFx0XHQub25DbGljaygoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRlbXBfbmR0X2xhbmcgIT0gJycgJiYgdGVtcF9uZHRfdXJsICE9ICcnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLkkxOE5fTkRUX0FQSVNbdGVtcF9uZHRfbGFuZ10gPSB0ZW1wX25kdF91cmw7XHJcblx0XHRcdFx0XHR0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdUYWIuZGlzcGxheSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdCk7XHJcblx0XHRpMThuTmR0QXBpcy5hZGRCdXR0b24oY2IgPT4gY2JcclxuXHRcdFx0LnNldEJ1dHRvblRleHQodGhpcy5zZXR0aW5ncy5JMThOX05EVF9BUElTX0RJU1BMQVkgPyAnXHU5NjkwXHU4NUNGJyA6ICdcdTY3RTVcdTc3MEInKVxyXG5cdFx0XHQub25DbGljaygoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5JMThOX05EVF9BUElTX0RJU1BMQVkgPSAhdGhpcy5zZXR0aW5ncy5JMThOX05EVF9BUElTX0RJU1BMQVk7XHJcblx0XHRcdFx0dGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdHRoaXMuc2V0dGluZ1RhYi5kaXNwbGF5KCk7XHJcblx0XHRcdH0pXHJcblx0XHQpO1xyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9ORFRfQVBJU19ESVNQTEFZKSB7XHJcblx0XHRcdGZvciAoY29uc3Qga2V5IGluIHRoaXMuc2V0dGluZ3MuSTE4Tl9ORFRfQVBJUykge1xyXG5cdFx0XHRcdGNvbnN0IGkxOG5ORFRVUkwgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuXHRcdFx0XHRpMThuTkRUVVJMLnNldE5hbWUoa2V5KTtcclxuXHRcdFx0XHRpMThuTkRUVVJMLnNldERlc2ModGhpcy5zZXR0aW5ncy5JMThOX05EVF9BUElTW2tleV0pO1xyXG5cdFx0XHRcdGkxOG5ORFRVUkwuYWRkQnV0dG9uKGNiID0+IGNiXHJcblx0XHRcdFx0XHQuc2V0SWNvbigndHJhc2gnKVxyXG5cdFx0XHRcdFx0Lm9uQ2xpY2soKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5zZXR0aW5ncy5JMThOX05EVF9BUElTW2tleV07XHJcblx0XHRcdFx0XHRcdHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5zZXR0aW5nVGFiLmRpc3BsYXkoKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0KVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59IiwgImltcG9ydCB7IFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IEJhc2VTZXR0aW5nIGZyb20gXCIuL2Jhc2Utc2V0dGluZ1wiO1xyXG5pbXBvcnQgeyB0IH0gZnJvbSBcInNyYy9sYW5nL2lueGRleFwiO1xyXG5pbXBvcnQgeyBBUElfVFlQRVMgfSBmcm9tIFwic3JjL2RhdGEvZGF0YVwiO1xyXG5pbXBvcnQgeyBBUEkgfSBmcm9tICcuLi8uLi9hcGknO1xyXG5cclxuXHJcbi8vIFx1ODFFQVx1NTJBOFx1NjZGNFx1NjVCMFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJMThuTW9kZU5JVCBleHRlbmRzIEJhc2VTZXR0aW5nIHtcclxuICAgIG1haW4oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgYXBpID0gbmV3IEFQSSh0aGlzLmkxOG4pO1xyXG5cclxuICAgICAgICBjb25zdCBpMThuTW9kZU5JVCA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIGkxOG5Nb2RlTklULnNldENsYXNzKCdib2xkJyk7XHJcbiAgICAgICAgaTE4bk1vZGVOSVQuc2V0TmFtZShcIlx1NjczQVx1NTY2OFx1N0ZGQlx1OEJEMVx1NkEyMVx1NUYwRlwiKTtcclxuICAgICAgICBpMThuTW9kZU5JVC5hZGRUb2dnbGUoY2IgPT4gY2JcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFX05JVClcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFX05JVCA9ICF0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9OSVQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdUYWIuZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGkxOG5OSVRBUEkgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICBpZiAoISh0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9OSVQpKSBpMThuTklUQVBJLnNldENsYXNzKCdpMThuX2Rpc3BsYXktbm9uZScpO1xyXG4gICAgICAgIGkxOG5OSVRBUEkuc2V0TmFtZSgnXHU2M0E1XHU1M0UzJyk7XHJcbiAgICAgICAgaTE4bk5JVEFQSS5zZXREZXNjKHQoJ1NFVFRJTkdfTklUX0FQSVNfREVTQycpKTtcclxuICAgICAgICBpMThuTklUQVBJLmFkZERyb3Bkb3duKGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5hZGRPcHRpb25zKEFQSV9UWVBFUylcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fTklUX0FQSSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nVGFiLmRpc3BsYXkoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICAgIGkxOG5OSVRBUEkuYWRkQnV0dG9uKGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KCdcdTZENEJcdThCRDUnKVxyXG4gICAgICAgICAgICAub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQkFJRFUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuYmFpZHVUZXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnT1BFTkFJJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLm9wZW5BSVRlc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGkxOG5Nb2RlTklUSW50ZXJ2YWwgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICBpMThuTW9kZU5JVEludGVydmFsLnNldE5hbWUoJ1x1OTVGNFx1OTY5NCcpO1xyXG4gICAgICAgIGkxOG5Nb2RlTklUSW50ZXJ2YWwuc2V0RGVzYygnXHU3NTI4XHU0RThFXHU5NjUwXHU1MjM2XHU2QkNGXHU2QjIxXHU4QkY3XHU2QzQyXHU5NUY0XHU5Njk0KFx1NTM1NVx1NEY0RDogXHU2QkVCXHU3OUQyKScpO1xyXG4gICAgICAgIGlmICghKHRoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFX05JVCkpIGkxOG5Nb2RlTklUSW50ZXJ2YWwuc2V0Q2xhc3MoJ2kxOG5fZGlzcGxheS1ub25lJyk7XHJcbiAgICAgICAgaTE4bk1vZGVOSVRJbnRlcnZhbC5hZGRTbGlkZXIoY2IgPT4gY2JcclxuICAgICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcclxuICAgICAgICAgICAgLnNldExpbWl0cygwLCAxMDAwLCA1MClcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJX0lOVEVSVkFMKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fTklUX0FQSV9JTlRFUlZBTCA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59IiwgImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0bydcclxuaW1wb3J0IHsgUmVxdWVzdFVybFBhcmFtLCBSZXF1ZXN0VXJsUmVzcG9uc2VQcm9taXNlLCByZXF1ZXN0VXJsIH0gZnJvbSAnb2JzaWRpYW4nXHJcblxyXG5pbXBvcnQgSTE4TiBmcm9tIFwiLi4vbWFpblwiXHJcbmltcG9ydCB7IEkxOG5TZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MvZGF0YSdcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xyXG5pbXBvcnQgeyBOb3RpY2VFcnJvciwgTm90aWNlT3BlcmF0aW9uUmVzdWx0LCBQTm90aWNlIH0gZnJvbSAnc3JjL3V0aWxzJ1xyXG5pbXBvcnQgeyBCQUlEVV9FUlJPUl9DT0RFIH0gZnJvbSAnc3JjL2RhdGEvZGF0YSdcclxuXHJcbmV4cG9ydCBjbGFzcyBBUEkge1xyXG5cdGkxOG46IEkxOE47XHJcblx0c2V0dGluZ3M6IEkxOG5TZXR0aW5ncztcclxuXHJcblx0Y29uc3RydWN0b3IoaTE4bjogSTE4Tikge1xyXG5cdFx0dGhpcy5pMThuID0gaTE4bjtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSB0aGlzLmkxOG4uc2V0dGluZ3M7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgZGlyZWN0b3J5KCkge1xyXG5cdFx0bGV0IHJlcyA9IFtdO1xyXG5cdFx0Y29uc3QgUmVxdWVzdFVybFBhcmFtOiBSZXF1ZXN0VXJsUGFyYW0gPSB7XHJcblx0XHRcdHVybDogcGF0aC5qb2luKHRoaXMuc2V0dGluZ3MuSTE4Tl9ORFRfQVBJU1t0aGlzLnNldHRpbmdzLkkxOE5fTEFOR1VBR0VdLCAnZGlyZWN0b3J5Lmpzb24nKSxcclxuXHRcdFx0bWV0aG9kOiAnR0VUJ1xyXG5cdFx0fTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdFVybChSZXF1ZXN0VXJsUGFyYW0pO1xyXG5cdFx0XHRyZXMgPSByZXNwb25zZS5qc29uO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0Tm90aWNlRXJyb3IoJ1x1N0Y1MVx1N0VEQycsIGVycm9yKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXNcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhc3luYyBkaXJlY3RvcnlUZXN0KCkge1xyXG5cdFx0bGV0IHJlcyA9IHRydWU7XHJcblx0XHRjb25zdCBSZXF1ZXN0VXJsUGFyYW06IFJlcXVlc3RVcmxQYXJhbSA9IHtcclxuXHRcdFx0dXJsOiBwYXRoLmpvaW4odGhpcy5zZXR0aW5ncy5JMThOX05EVF9BUElTW3RoaXMuc2V0dGluZ3MuSTE4Tl9MQU5HVUFHRV0sICdkaXJlY3RvcnkuanNvbicpLFxyXG5cdFx0XHRtZXRob2Q6ICdHRVQnXHJcblx0XHR9O1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0YXdhaXQgcmVxdWVzdFVybChSZXF1ZXN0VXJsUGFyYW0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0cmVzID0gZmFsc2U7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTsgXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzXHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgaWdub3JlKCkge1xyXG5cdFx0bGV0IHJlc0RhdGEgPSBbXTtcclxuXHRcdGNvbnN0IFJlcXVlc3RVcmxQYXJhbTogUmVxdWVzdFVybFBhcmFtID0ge1xyXG5cdFx0XHR1cmw6IHBhdGguam9pbih0aGlzLnNldHRpbmdzLkkxOE5fTkRUX0FQSVNbdGhpcy5zZXR0aW5ncy5JMThOX0xBTkdVQUdFXSwgJ2lnbm9yZS5qc29uJyksXHJcblx0XHRcdG1ldGhvZDogJ0dFVCdcclxuXHRcdH07XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RVcmwoUmVxdWVzdFVybFBhcmFtKTtcclxuXHRcdFx0cmVzRGF0YSA9IHJlc3BvbnNlLmpzb247XHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHROb3RpY2VFcnJvcignXHU3RjUxXHU3RURDJywgZXJyb3IpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc0RhdGE7XHJcblx0fVxyXG5cdHB1YmxpYyBhc3luYyBpZ25vcmVUZXN0KCkge1xyXG5cdFx0bGV0IHJlcyA9IHRydWU7XHJcblx0XHRjb25zdCBSZXF1ZXN0VXJsUGFyYW06IFJlcXVlc3RVcmxQYXJhbSA9IHtcclxuXHRcdFx0dXJsOiBwYXRoLmpvaW4odGhpcy5zZXR0aW5ncy5JMThOX05EVF9BUElTW3RoaXMuc2V0dGluZ3MuSTE4Tl9MQU5HVUFHRV0sICdpZ25vcmUuanNvbicpLFxyXG5cdFx0XHRtZXRob2Q6ICdHRVQnXHJcblx0XHR9O1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0YXdhaXQgcmVxdWVzdFVybChSZXF1ZXN0VXJsUGFyYW0pO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0cmVzID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzO1xyXG5cdH1cclxuXHJcblx0XHJcblx0cHVibGljIGFzeW5jIHRyYW5zbGF0aW9uKGlkOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZykge1xyXG5cdFx0bGV0IHJlcztcclxuXHRcdGNvbnN0IFJlcXVlc3RVcmxQYXJhbTogUmVxdWVzdFVybFBhcmFtID0ge1xyXG5cdFx0XHR1cmw6IHBhdGguam9pbih0aGlzLnNldHRpbmdzLkkxOE5fTkRUX0FQSVNbdGhpcy5zZXR0aW5ncy5JMThOX0xBTkdVQUdFXSwgYHBsdWdpbnNcXFxcJHtpZH1cXFxcJHt2ZXJzaW9ufS5qc29uYCksXHJcblx0XHRcdG1ldGhvZDogJ0dFVCdcclxuXHRcdH07XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RVcmwoUmVxdWVzdFVybFBhcmFtKTtcclxuXHRcdFx0cmVzID0gcmVzcG9uc2UuanNvbjtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBiYWlkdShxOiBzdHJpbmcpOiBSZXF1ZXN0VXJsUmVzcG9uc2VQcm9taXNlIHtcclxuXHRcdGNvbnN0IEJBSURVID0gdGhpcy5pMThuLnNldHRpbmdzLkkxOE5fTklUX0FQSVMuQkFJRFVcclxuXHRcdGNvbnN0IG1kNSA9IGNyZWF0ZUhhc2goJ21kNScpO1xyXG5cdFx0Y29uc3QgZnJvbSA9IEJBSURVLkZST007XHJcblx0XHRjb25zdCB0byA9IEJBSURVLlRPO1xyXG5cdFx0Y29uc3QgYXBwaWQgPSBCQUlEVS5BUFBfSUQ7XHJcblx0XHRjb25zdCBrZXkgPSBCQUlEVS5LRVk7XHJcblx0XHRjb25zdCBzYWx0ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTApO1xyXG5cdFx0Y29uc3Qgc2lnbiA9IG1kNS51cGRhdGUoYCR7YXBwaWR9JHtxfSR7c2FsdH0ke2tleX1gKS5kaWdlc3QoJ2hleCcpO1xyXG5cdFx0Y29uc3QgUmVxdWVzdFVybFBhcmFtOiBSZXF1ZXN0VXJsUGFyYW0gPSB7XHJcblx0XHRcdHVybDogYGh0dHBzOi8vZmFueWktYXBpLmJhaWR1LmNvbS9hcGkvdHJhbnMvdmlwL3RyYW5zbGF0ZT9xPSR7cX0mZnJvbT0ke2Zyb219JnRvPSR7dG99JmFwcGlkPSR7YXBwaWR9JnNhbHQ9JHtzYWx0fSZzaWduPSR7c2lnbn1gLFxyXG5cdFx0XHRtZXRob2Q6ICdHRVQnXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIHJlcXVlc3RVcmwoUmVxdWVzdFVybFBhcmFtKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBiYWlkdVRlc3QoKSB7XHJcblx0XHRjb25zdCBCQUlEVSA9IHRoaXMuaTE4bi5zZXR0aW5ncy5JMThOX05JVF9BUElTLkJBSURVXHJcblx0XHRjb25zdCBtZDUgPSBjcmVhdGVIYXNoKCdtZDUnKTtcclxuXHRcdGNvbnN0IGZyb20gPSBCQUlEVS5GUk9NO1xyXG5cdFx0Y29uc3QgdG8gPSBCQUlEVS5UTztcclxuXHRcdGNvbnN0IGFwcGlkID0gQkFJRFUuQVBQX0lEO1xyXG5cdFx0Y29uc3Qga2V5ID0gQkFJRFUuS0VZO1xyXG5cdFx0Y29uc3Qgc2FsdCA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuXHRcdGNvbnN0IHNpZ24gPSBtZDUudXBkYXRlKGAke2FwcGlkfSR7J2kxOG4nfSR7c2FsdH0ke2tleX1gKS5kaWdlc3QoJ2hleCcpO1xyXG5cclxuXHRcdGNvbnN0IFJlcXVlc3RVcmxQYXJhbTogUmVxdWVzdFVybFBhcmFtID0ge1xyXG5cdFx0XHR1cmw6IGBodHRwczovL2ZhbnlpLWFwaS5iYWlkdS5jb20vYXBpL3RyYW5zL3ZpcC90cmFuc2xhdGU/cT0keydpMThuJ30mZnJvbT0ke2Zyb219JnRvPSR7dG99JmFwcGlkPSR7YXBwaWR9JnNhbHQ9JHtzYWx0fSZzaWduPSR7c2lnbn1gLFxyXG5cdFx0XHRtZXRob2Q6ICdHRVQnXHJcblx0XHR9O1xyXG5cdFx0Y29uc3QgcmVzcG9uc2UgPSByZXF1ZXN0VXJsKFJlcXVlc3RVcmxQYXJhbSk7XHJcblx0XHRyZXNwb25zZS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0aWYgKHJlcy5qc29uLmhhc093blByb3BlcnR5KFwiZXJyb3JfY29kZVwiKSkge1xyXG5cdFx0XHRcdGNvbnN0IGVycm9yX2NvZGUgPSByZXMuanNvbi5lcnJvcl9jb2RlO1xyXG5cdFx0XHRcdE5vdGljZUVycm9yKCdcdTc2N0VcdTVFQTYnLCBgJHtlcnJvcl9jb2RlfVxcbiR7QkFJRFVfRVJST1JfQ09ERVtlcnJvcl9jb2RlXX1gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHROb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NzY3RVx1NUVBNicsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KS5jYXRjaCgoZXJyb3IpID0+IHtcclxuXHRcdFx0Tm90aWNlT3BlcmF0aW9uUmVzdWx0KCdcdTc2N0VcdTVFQTYnLCBmYWxzZSwgZXJyb3IpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgb3BlbkFJKHBsdWdpbjogc3RyaW5nLCBxOiBzdHJpbmcpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChgJHt0aGlzLnNldHRpbmdzLkkxOE5fTklUX09QRU5BSV9VUkx9L3YxL2NoYXQvY29tcGxldGlvbnNgLCB7XHJcblx0XHRcdFx0bW9kZWw6IHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfT1BFTkFJX01PREVMLFxyXG5cdFx0XHRcdG1lc3NhZ2VzOiBbXHJcblx0XHRcdFx0XHR7IHJvbGU6ICd1c2VyJywgY29udGVudDogdGhpcy5zZXR0aW5ncy5JMThOX05JVF9PUEVOQUlfVElQUyB9LFxyXG5cdFx0XHRcdFx0eyByb2xlOiAndXNlcicsIGNvbnRlbnQ6IHEgfVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0dGVtcGVyYXR1cmU6IDAuN1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHRcdCdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3RoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfT1BFTkFJX0tFWX1gXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEgJiYgcmVzcG9uc2UuZGF0YS5jaG9pY2VzICYmIHJlc3BvbnNlLmRhdGEuY2hvaWNlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGEuY2hvaWNlc1swXS5tZXNzYWdlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0UE5vdGljZSgnXHU5NTE5XHU4QkVGJywgZXJyb3IpO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBvcGVuQUlUZXN0KCkge1xyXG5cdFx0Y29uc3QgUmVxdWVzdFVybFBhcmFtOiBSZXF1ZXN0VXJsUGFyYW0gPSB7XHJcblx0XHRcdHVybDogYCR7dGhpcy5zZXR0aW5ncy5JMThOX05JVF9PUEVOQUlfVVJMfS92MS9jaGF0L2NvbXBsZXRpb25zYCxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG5cdFx0XHRcdCdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3RoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfT1BFTkFJX0tFWX1gXHJcblx0XHRcdH0sXHJcblx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRtb2RlbDogdGhpcy5zZXR0aW5ncy5JMThOX05JVF9PUEVOQUlfTU9ERUwsXHJcblx0XHRcdFx0bWVzc2FnZXM6IFtcclxuXHRcdFx0XHRcdHsgcm9sZTogJ3VzZXInLCBjb250ZW50OiAnaTE4bicgfVxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0dGVtcGVyYXR1cmU6IDAuN1xyXG5cdFx0XHR9KSxcclxuXHRcdH07XHJcblx0XHRjb25zdCByZXNwb25zZSA9IHJlcXVlc3RVcmwoUmVxdWVzdFVybFBhcmFtKTtcclxuXHRcdHJlc3BvbnNlLnRoZW4oKCkgPT4ge1xyXG5cdFx0XHROb3RpY2VPcGVyYXRpb25SZXN1bHQoJ09wZW5BSScsIHRydWUpO1xyXG5cdFx0fSkuY2F0Y2goKGVycm9yKSA9PiB7XHJcblx0XHRcdE5vdGljZU9wZXJhdGlvblJlc3VsdCgnT3BlbkFJJywgZmFsc2UsIGVycm9yKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFzeW5jIGdpdGVlSXNzdWUodGl0bGU6IHN0cmluZywgYm9keTogc3RyaW5nKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHQvLyB0aXRsZVx1OTU3Rlx1NUVBNjE5MSBib2R5XHU5NTdGXHU1RUE2NjU1MzVcdTRFMkFcdTVCNTdcdTdCMjZcclxuXHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KGBodHRwczovL2dpdGVlLmNvbS9hcGkvdjUvcmVwb3MvemVyby0tdHdvL2lzc3Vlc2AsIHtcclxuXHRcdFx0XHRhY2Nlc3NfdG9rZW46ICdkYWYzN2E4ZmQwNjBmZWQ4NzRhZjMzMTRlZTUyOTU5YicsXHJcblx0XHRcdFx0cmVwbzogJ29ic2lkaWFuLWkxOG4tdHJhbnNsYXRpb24nLFxyXG5cdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRib2R5OiBib2R5LFxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHRcdCdDaGFyc2V0JzogJ1VURi04JyxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHROb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1OEJEMVx1NjU4N1x1NjNEMFx1NEVBNCcsIHRydWUpO1xyXG5cdFx0XHRpZiAocmVzcG9uc2UuZGF0YS5udW1iZXIpIHJldHVybiByZXNwb25zZS5kYXRhLm51bWJlcjtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHROb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1OEJEMVx1NjU4N1x1NjNEMFx1NEVBNCcsIGZhbHNlLCBgJHtlcnJvcn1gKTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgZ2l0ZWVnZXRJc3N1ZSgpIHtcclxuXHRcdGxldCByZXMgPSBbXTtcclxuXHRcdGNvbnN0IG93bmVyID0gJ3plcm8tLXR3byc7XHJcblx0XHRjb25zdCByZXBvID0gJ29ic2lkaWFuLWkxOG4tdHJhbnNsYXRpb24nO1xyXG5cdFx0Y29uc3QgUmVxdWVzdFVybFBhcmFtOiBSZXF1ZXN0VXJsUGFyYW0gPSB7XHJcblx0XHRcdHVybDogYGh0dHBzOi8vZ2l0ZWUuY29tL2FwaS92NS9yZXBvcy8ke293bmVyfS8ke3JlcG99L2lzc3Vlc2AsXHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG5cdFx0XHRcdCdDaGFyc2V0JzogJ1VURi04JyxcclxuXHRcdFx0fSxcclxuXHRcdH07XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RVcmwoUmVxdWVzdFVybFBhcmFtKTtcclxuXHRcdFx0cmVzID0gcmVzcG9uc2UuanNvbjtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdE5vdGljZUVycm9yKCdcdTdGNTFcdTdFREMnLCBlcnJvcik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzXHJcblx0fVxyXG5cclxuXHJcbn0iLCAiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuIiwgIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGJpbmQgZnJvbSAnLi9oZWxwZXJzL2JpbmQuanMnO1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG5jb25zdCB7dG9TdHJpbmd9ID0gT2JqZWN0LnByb3RvdHlwZTtcbmNvbnN0IHtnZXRQcm90b3R5cGVPZn0gPSBPYmplY3Q7XG5cbmNvbnN0IGtpbmRPZiA9IChjYWNoZSA9PiB0aGluZyA9PiB7XG4gICAgY29uc3Qgc3RyID0gdG9TdHJpbmcuY2FsbCh0aGluZyk7XG4gICAgcmV0dXJuIGNhY2hlW3N0cl0gfHwgKGNhY2hlW3N0cl0gPSBzdHIuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkpO1xufSkoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG5cbmNvbnN0IGtpbmRPZlRlc3QgPSAodHlwZSkgPT4ge1xuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKHRoaW5nKSA9PiBraW5kT2YodGhpbmcpID09PSB0eXBlXG59XG5cbmNvbnN0IHR5cGVPZlRlc3QgPSB0eXBlID0+IHRoaW5nID0+IHR5cGVvZiB0aGluZyA9PT0gdHlwZTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IHtpc0FycmF5fSA9IEFycmF5O1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzVW5kZWZpbmVkID0gdHlwZU9mVGVzdCgndW5kZWZpbmVkJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgaXNGdW5jdGlvbih2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIpICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQXJyYXlCdWZmZXIgPSBraW5kT2ZUZXN0KCdBcnJheUJ1ZmZlcicpO1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgbGV0IHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAoaXNBcnJheUJ1ZmZlcih2YWwuYnVmZmVyKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1N0cmluZyA9IHR5cGVPZlRlc3QoJ3N0cmluZycpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRnVuY3Rpb24gPSB0eXBlT2ZUZXN0KCdmdW5jdGlvbicpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzTnVtYmVyID0gdHlwZU9mVGVzdCgnbnVtYmVyJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzT2JqZWN0ID0gKHRoaW5nKSA9PiB0aGluZyAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQm9vbGVhblxuICpcbiAqIEBwYXJhbSB7Kn0gdGhpbmcgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQm9vbGVhbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQm9vbGVhbiA9IHRoaW5nID0+IHRoaW5nID09PSB0cnVlIHx8IHRoaW5nID09PSBmYWxzZTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1BsYWluT2JqZWN0ID0gKHZhbCkgPT4ge1xuICBpZiAoa2luZE9mKHZhbCkgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIChwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpID09PSBudWxsKSAmJiAhKFN5bWJvbC50b1N0cmluZ1RhZyBpbiB2YWwpICYmICEoU3ltYm9sLml0ZXJhdG9yIGluIHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0RhdGUgPSBraW5kT2ZUZXN0KCdEYXRlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0ZpbGUgPSBraW5kT2ZUZXN0KCdGaWxlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0Jsb2IgPSBraW5kT2ZUZXN0KCdCbG9iJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlTGlzdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNGaWxlTGlzdCA9IGtpbmRPZlRlc3QoJ0ZpbGVMaXN0Jyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNTdHJlYW0gPSAodmFsKSA9PiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0geyp9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0Zvcm1EYXRhID0gKHRoaW5nKSA9PiB7XG4gIGxldCBraW5kO1xuICByZXR1cm4gdGhpbmcgJiYgKFxuICAgICh0eXBlb2YgRm9ybURhdGEgPT09ICdmdW5jdGlvbicgJiYgdGhpbmcgaW5zdGFuY2VvZiBGb3JtRGF0YSkgfHwgKFxuICAgICAgaXNGdW5jdGlvbih0aGluZy5hcHBlbmQpICYmIChcbiAgICAgICAgKGtpbmQgPSBraW5kT2YodGhpbmcpKSA9PT0gJ2Zvcm1kYXRhJyB8fFxuICAgICAgICAvLyBkZXRlY3QgZm9ybS1kYXRhIGluc3RhbmNlXG4gICAgICAgIChraW5kID09PSAnb2JqZWN0JyAmJiBpc0Z1bmN0aW9uKHRoaW5nLnRvU3RyaW5nKSAmJiB0aGluZy50b1N0cmluZygpID09PSAnW29iamVjdCBGb3JtRGF0YV0nKVxuICAgICAgKVxuICAgIClcbiAgKVxufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNVUkxTZWFyY2hQYXJhbXMgPSBraW5kT2ZUZXN0KCdVUkxTZWFyY2hQYXJhbXMnKTtcblxuY29uc3QgW2lzUmVhZGFibGVTdHJlYW0sIGlzUmVxdWVzdCwgaXNSZXNwb25zZSwgaXNIZWFkZXJzXSA9IFsnUmVhZGFibGVTdHJlYW0nLCAnUmVxdWVzdCcsICdSZXNwb25zZScsICdIZWFkZXJzJ10ubWFwKGtpbmRPZlRlc3QpO1xuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5jb25zdCB0cmltID0gKHN0cikgPT4gc3RyLnRyaW0gP1xuICBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFthbGxPd25LZXlzID0gZmFsc2VdXG4gKiBAcmV0dXJucyB7YW55fVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4sIHthbGxPd25LZXlzID0gZmFsc2V9ID0ge30pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgaTtcbiAgbGV0IGw7XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGNvbnN0IGtleXMgPSBhbGxPd25LZXlzID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKSA6IE9iamVjdC5rZXlzKG9iaik7XG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgbGV0IGtleTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEtleShvYmosIGtleSkge1xuICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gIGxldCBpID0ga2V5cy5sZW5ndGg7XG4gIGxldCBfa2V5O1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIF9rZXkgPSBrZXlzW2ldO1xuICAgIGlmIChrZXkgPT09IF9rZXkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgcmV0dXJuIF9rZXk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBfZ2xvYmFsID0gKCgpID0+IHtcbiAgLyplc2xpbnQgbm8tdW5kZWY6MCovXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGdsb2JhbFRoaXM7XG4gIHJldHVybiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpXG59KSgpO1xuXG5jb25zdCBpc0NvbnRleHREZWZpbmVkID0gKGNvbnRleHQpID0+ICFpc1VuZGVmaW5lZChjb250ZXh0KSAmJiBjb250ZXh0ICE9PSBfZ2xvYmFsO1xuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIGNvbnN0IHtjYXNlbGVzc30gPSBpc0NvbnRleHREZWZpbmVkKHRoaXMpICYmIHRoaXMgfHwge307XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBjb25zdCBhc3NpZ25WYWx1ZSA9ICh2YWwsIGtleSkgPT4ge1xuICAgIGNvbnN0IHRhcmdldEtleSA9IGNhc2VsZXNzICYmIGZpbmRLZXkocmVzdWx0LCBrZXkpIHx8IGtleTtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRbdGFyZ2V0S2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IG1lcmdlKHJlc3VsdFt0YXJnZXRLZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBhcmd1bWVudHNbaV0gJiYgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBbYWxsT3duS2V5c11cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuY29uc3QgZXh0ZW5kID0gKGEsIGIsIHRoaXNBcmcsIHthbGxPd25LZXlzfT0ge30pID0+IHtcbiAgZm9yRWFjaChiLCAodmFsLCBrZXkpID0+IHtcbiAgICBpZiAodGhpc0FyZyAmJiBpc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSwge2FsbE93bktleXN9KTtcbiAgcmV0dXJuIGE7XG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmNvbnN0IHN0cmlwQk9NID0gKGNvbnRlbnQpID0+IHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IFtwcm9wc11cbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVzY3JpcHRvcnNdXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmNvbnN0IGluaGVyaXRzID0gKGNvbnN0cnVjdG9yLCBzdXBlckNvbnN0cnVjdG9yLCBwcm9wcywgZGVzY3JpcHRvcnMpID0+IHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNvbnN0cnVjdG9yLnByb3RvdHlwZSwgZGVzY3JpcHRvcnMpO1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLCAnc3VwZXInLCB7XG4gICAgdmFsdWU6IHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlXG4gIH0pO1xuICBwcm9wcyAmJiBPYmplY3QuYXNzaWduKGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFJlc29sdmUgb2JqZWN0IHdpdGggZGVlcCBwcm90b3R5cGUgY2hhaW4gdG8gYSBmbGF0IG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZU9iaiBzb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gW2Rlc3RPYmpdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufEJvb2xlYW59IFtmaWx0ZXJdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvcEZpbHRlcl1cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5jb25zdCB0b0ZsYXRPYmplY3QgPSAoc291cmNlT2JqLCBkZXN0T2JqLCBmaWx0ZXIsIHByb3BGaWx0ZXIpID0+IHtcbiAgbGV0IHByb3BzO1xuICBsZXQgaTtcbiAgbGV0IHByb3A7XG4gIGNvbnN0IG1lcmdlZCA9IHt9O1xuXG4gIGRlc3RPYmogPSBkZXN0T2JqIHx8IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgaWYgKHNvdXJjZU9iaiA9PSBudWxsKSByZXR1cm4gZGVzdE9iajtcblxuICBkbyB7XG4gICAgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VPYmopO1xuICAgIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgIHByb3AgPSBwcm9wc1tpXTtcbiAgICAgIGlmICgoIXByb3BGaWx0ZXIgfHwgcHJvcEZpbHRlcihwcm9wLCBzb3VyY2VPYmosIGRlc3RPYmopKSAmJiAhbWVyZ2VkW3Byb3BdKSB7XG4gICAgICAgIGRlc3RPYmpbcHJvcF0gPSBzb3VyY2VPYmpbcHJvcF07XG4gICAgICAgIG1lcmdlZFtwcm9wXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvdXJjZU9iaiA9IGZpbHRlciAhPT0gZmFsc2UgJiYgZ2V0UHJvdG90eXBlT2Yoc291cmNlT2JqKTtcbiAgfSB3aGlsZSAoc291cmNlT2JqICYmICghZmlsdGVyIHx8IGZpbHRlcihzb3VyY2VPYmosIGRlc3RPYmopKSAmJiBzb3VyY2VPYmogIT09IE9iamVjdC5wcm90b3R5cGUpO1xuXG4gIHJldHVybiBkZXN0T2JqO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHN0cmluZyBlbmRzIHdpdGggdGhlIGNoYXJhY3RlcnMgb2YgYSBzcGVjaWZpZWQgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFN0cmluZ1xuICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbj0gMF1cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgZW5kc1dpdGggPSAoc3RyLCBzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKSA9PiB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCB8fCBwb3NpdGlvbiA+IHN0ci5sZW5ndGgpIHtcbiAgICBwb3NpdGlvbiA9IHN0ci5sZW5ndGg7XG4gIH1cbiAgcG9zaXRpb24gLT0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgY29uc3QgbGFzdEluZGV4ID0gc3RyLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbik7XG4gIHJldHVybiBsYXN0SW5kZXggIT09IC0xICYmIGxhc3RJbmRleCA9PT0gcG9zaXRpb247XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5ldyBhcnJheSBmcm9tIGFycmF5IGxpa2Ugb2JqZWN0IG9yIG51bGwgaWYgZmFpbGVkXG4gKlxuICogQHBhcmFtIHsqfSBbdGhpbmddXG4gKlxuICogQHJldHVybnMgez9BcnJheX1cbiAqL1xuY29uc3QgdG9BcnJheSA9ICh0aGluZykgPT4ge1xuICBpZiAoIXRoaW5nKSByZXR1cm4gbnVsbDtcbiAgaWYgKGlzQXJyYXkodGhpbmcpKSByZXR1cm4gdGhpbmc7XG4gIGxldCBpID0gdGhpbmcubGVuZ3RoO1xuICBpZiAoIWlzTnVtYmVyKGkpKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYXJyID0gbmV3IEFycmF5KGkpO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGFycltpXSA9IHRoaW5nW2ldO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbi8qKlxuICogQ2hlY2tpbmcgaWYgdGhlIFVpbnQ4QXJyYXkgZXhpc3RzIGFuZCBpZiBpdCBkb2VzLCBpdCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgaWYgdGhlXG4gKiB0aGluZyBwYXNzZWQgaW4gaXMgYW4gaW5zdGFuY2Ugb2YgVWludDhBcnJheVxuICpcbiAqIEBwYXJhbSB7VHlwZWRBcnJheX1cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5jb25zdCBpc1R5cGVkQXJyYXkgPSAoVHlwZWRBcnJheSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHJldHVybiB0aGluZyA9PiB7XG4gICAgcmV0dXJuIFR5cGVkQXJyYXkgJiYgdGhpbmcgaW5zdGFuY2VvZiBUeXBlZEFycmF5O1xuICB9O1xufSkodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIGdldFByb3RvdHlwZU9mKFVpbnQ4QXJyYXkpKTtcblxuLyoqXG4gKiBGb3IgZWFjaCBlbnRyeSBpbiB0aGUgb2JqZWN0LCBjYWxsIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBrZXkgYW5kIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PGFueSwgYW55Pn0gb2JqIC0gVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGVudHJ5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5jb25zdCBmb3JFYWNoRW50cnkgPSAob2JqLCBmbikgPT4ge1xuICBjb25zdCBnZW5lcmF0b3IgPSBvYmogJiYgb2JqW1N5bWJvbC5pdGVyYXRvcl07XG5cbiAgY29uc3QgaXRlcmF0b3IgPSBnZW5lcmF0b3IuY2FsbChvYmopO1xuXG4gIGxldCByZXN1bHQ7XG5cbiAgd2hpbGUgKChyZXN1bHQgPSBpdGVyYXRvci5uZXh0KCkpICYmICFyZXN1bHQuZG9uZSkge1xuICAgIGNvbnN0IHBhaXIgPSByZXN1bHQudmFsdWU7XG4gICAgZm4uY2FsbChvYmosIHBhaXJbMF0sIHBhaXJbMV0pO1xuICB9XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSByZWd1bGFyIGV4cHJlc3Npb24gYW5kIGEgc3RyaW5nLCBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdGhlIG1hdGNoZXNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnRXhwIC0gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBhZ2FpbnN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc2VhcmNoLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheTxib29sZWFuPn1cbiAqL1xuY29uc3QgbWF0Y2hBbGwgPSAocmVnRXhwLCBzdHIpID0+IHtcbiAgbGV0IG1hdGNoZXM7XG4gIGNvbnN0IGFyciA9IFtdO1xuXG4gIHdoaWxlICgobWF0Y2hlcyA9IHJlZ0V4cC5leGVjKHN0cikpICE9PSBudWxsKSB7XG4gICAgYXJyLnB1c2gobWF0Y2hlcyk7XG4gIH1cblxuICByZXR1cm4gYXJyO1xufVxuXG4vKiBDaGVja2luZyBpZiB0aGUga2luZE9mVGVzdCBmdW5jdGlvbiByZXR1cm5zIHRydWUgd2hlbiBwYXNzZWQgYW4gSFRNTEZvcm1FbGVtZW50LiAqL1xuY29uc3QgaXNIVE1MRm9ybSA9IGtpbmRPZlRlc3QoJ0hUTUxGb3JtRWxlbWVudCcpO1xuXG5jb25zdCB0b0NhbWVsQ2FzZSA9IHN0ciA9PiB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9cXHNdKFthLXpcXGRdKShcXHcqKS9nLFxuICAgIGZ1bmN0aW9uIHJlcGxhY2VyKG0sIHAxLCBwMikge1xuICAgICAgcmV0dXJuIHAxLnRvVXBwZXJDYXNlKCkgKyBwMjtcbiAgICB9XG4gICk7XG59O1xuXG4vKiBDcmVhdGluZyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBjaGVjayBpZiBhbiBvYmplY3QgaGFzIGEgcHJvcGVydHkuICovXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9ICgoe2hhc093blByb3BlcnR5fSkgPT4gKG9iaiwgcHJvcCkgPT4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKShPYmplY3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzUmVnRXhwID0ga2luZE9mVGVzdCgnUmVnRXhwJyk7XG5cbmNvbnN0IHJlZHVjZURlc2NyaXB0b3JzID0gKG9iaiwgcmVkdWNlcikgPT4ge1xuICBjb25zdCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaik7XG4gIGNvbnN0IHJlZHVjZWREZXNjcmlwdG9ycyA9IHt9O1xuXG4gIGZvckVhY2goZGVzY3JpcHRvcnMsIChkZXNjcmlwdG9yLCBuYW1lKSA9PiB7XG4gICAgbGV0IHJldDtcbiAgICBpZiAoKHJldCA9IHJlZHVjZXIoZGVzY3JpcHRvciwgbmFtZSwgb2JqKSkgIT09IGZhbHNlKSB7XG4gICAgICByZWR1Y2VkRGVzY3JpcHRvcnNbbmFtZV0gPSByZXQgfHwgZGVzY3JpcHRvcjtcbiAgICB9XG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG9iaiwgcmVkdWNlZERlc2NyaXB0b3JzKTtcbn1cblxuLyoqXG4gKiBNYWtlcyBhbGwgbWV0aG9kcyByZWFkLW9ubHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuXG5jb25zdCBmcmVlemVNZXRob2RzID0gKG9iaikgPT4ge1xuICByZWR1Y2VEZXNjcmlwdG9ycyhvYmosIChkZXNjcmlwdG9yLCBuYW1lKSA9PiB7XG4gICAgLy8gc2tpcCByZXN0cmljdGVkIHByb3BzIGluIHN0cmljdCBtb2RlXG4gICAgaWYgKGlzRnVuY3Rpb24ob2JqKSAmJiBbJ2FyZ3VtZW50cycsICdjYWxsZXInLCAnY2FsbGVlJ10uaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgIGlmICghaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybjtcblxuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGZhbHNlO1xuXG4gICAgaWYgKCd3cml0YWJsZScgaW4gZGVzY3JpcHRvcikge1xuICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gKCkgPT4ge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2FuIG5vdCByZXdyaXRlIHJlYWQtb25seSBtZXRob2QgXFwnJyArIG5hbWUgKyAnXFwnJyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IHRvT2JqZWN0U2V0ID0gKGFycmF5T3JTdHJpbmcsIGRlbGltaXRlcikgPT4ge1xuICBjb25zdCBvYmogPSB7fTtcblxuICBjb25zdCBkZWZpbmUgPSAoYXJyKSA9PiB7XG4gICAgYXJyLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgb2JqW3ZhbHVlXSA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBpc0FycmF5KGFycmF5T3JTdHJpbmcpID8gZGVmaW5lKGFycmF5T3JTdHJpbmcpIDogZGVmaW5lKFN0cmluZyhhcnJheU9yU3RyaW5nKS5zcGxpdChkZWxpbWl0ZXIpKTtcblxuICByZXR1cm4gb2JqO1xufVxuXG5jb25zdCBub29wID0gKCkgPT4ge31cblxuY29uc3QgdG9GaW5pdGVOdW1iZXIgPSAodmFsdWUsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUgPSArdmFsdWUpID8gdmFsdWUgOiBkZWZhdWx0VmFsdWU7XG59XG5cbmNvbnN0IEFMUEhBID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6J1xuXG5jb25zdCBESUdJVCA9ICcwMTIzNDU2Nzg5JztcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gIERJR0lULFxuICBBTFBIQSxcbiAgQUxQSEFfRElHSVQ6IEFMUEhBICsgQUxQSEEudG9VcHBlckNhc2UoKSArIERJR0lUXG59XG5cbmNvbnN0IGdlbmVyYXRlU3RyaW5nID0gKHNpemUgPSAxNiwgYWxwaGFiZXQgPSBBTFBIQUJFVC5BTFBIQV9ESUdJVCkgPT4ge1xuICBsZXQgc3RyID0gJyc7XG4gIGNvbnN0IHtsZW5ndGh9ID0gYWxwaGFiZXQ7XG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICBzdHIgKz0gYWxwaGFiZXRbTWF0aC5yYW5kb20oKSAqIGxlbmd0aHwwXVxuICB9XG5cbiAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBJZiB0aGUgdGhpbmcgaXMgYSBGb3JtRGF0YSBvYmplY3QsIHJldHVybiB0cnVlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGhpbmcgLSBUaGUgdGhpbmcgdG8gY2hlY2suXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzU3BlY0NvbXBsaWFudEZvcm0odGhpbmcpIHtcbiAgcmV0dXJuICEhKHRoaW5nICYmIGlzRnVuY3Rpb24odGhpbmcuYXBwZW5kKSAmJiB0aGluZ1tTeW1ib2wudG9TdHJpbmdUYWddID09PSAnRm9ybURhdGEnICYmIHRoaW5nW1N5bWJvbC5pdGVyYXRvcl0pO1xufVxuXG5jb25zdCB0b0pTT05PYmplY3QgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IEFycmF5KDEwKTtcblxuICBjb25zdCB2aXNpdCA9IChzb3VyY2UsIGkpID0+IHtcblxuICAgIGlmIChpc09iamVjdChzb3VyY2UpKSB7XG4gICAgICBpZiAoc3RhY2suaW5kZXhPZihzb3VyY2UpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZighKCd0b0pTT04nIGluIHNvdXJjZSkpIHtcbiAgICAgICAgc3RhY2tbaV0gPSBzb3VyY2U7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGlzQXJyYXkoc291cmNlKSA/IFtdIDoge307XG5cbiAgICAgICAgZm9yRWFjaChzb3VyY2UsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVkdWNlZFZhbHVlID0gdmlzaXQodmFsdWUsIGkgKyAxKTtcbiAgICAgICAgICAhaXNVbmRlZmluZWQocmVkdWNlZFZhbHVlKSAmJiAodGFyZ2V0W2tleV0gPSByZWR1Y2VkVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGFja1tpXSA9IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICByZXR1cm4gdmlzaXQob2JqLCAwKTtcbn1cblxuY29uc3QgaXNBc3luY0ZuID0ga2luZE9mVGVzdCgnQXN5bmNGdW5jdGlvbicpO1xuXG5jb25zdCBpc1RoZW5hYmxlID0gKHRoaW5nKSA9PlxuICB0aGluZyAmJiAoaXNPYmplY3QodGhpbmcpIHx8IGlzRnVuY3Rpb24odGhpbmcpKSAmJiBpc0Z1bmN0aW9uKHRoaW5nLnRoZW4pICYmIGlzRnVuY3Rpb24odGhpbmcuY2F0Y2gpO1xuXG4vLyBvcmlnaW5hbCBjb2RlXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRGlnaXRhbEJyYWluSlMvQXhpb3NQcm9taXNlL2Jsb2IvMTZkZWFiMTM3MTBlYzA5Nzc5OTIyMTMxZjNmYTU5NTQzMjBmODNhYi9saWIvdXRpbHMuanMjTDExLUwzNFxuXG5jb25zdCBfc2V0SW1tZWRpYXRlID0gKChzZXRJbW1lZGlhdGVTdXBwb3J0ZWQsIHBvc3RNZXNzYWdlU3VwcG9ydGVkKSA9PiB7XG4gIGlmIChzZXRJbW1lZGlhdGVTdXBwb3J0ZWQpIHtcbiAgICByZXR1cm4gc2V0SW1tZWRpYXRlO1xuICB9XG5cbiAgcmV0dXJuIHBvc3RNZXNzYWdlU3VwcG9ydGVkID8gKCh0b2tlbiwgY2FsbGJhY2tzKSA9PiB7XG4gICAgX2dsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoe3NvdXJjZSwgZGF0YX0pID0+IHtcbiAgICAgIGlmIChzb3VyY2UgPT09IF9nbG9iYWwgJiYgZGF0YSA9PT0gdG9rZW4pIHtcbiAgICAgICAgY2FsbGJhY2tzLmxlbmd0aCAmJiBjYWxsYmFja3Muc2hpZnQoKSgpO1xuICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiAoY2IpID0+IHtcbiAgICAgIGNhbGxiYWNrcy5wdXNoKGNiKTtcbiAgICAgIF9nbG9iYWwucG9zdE1lc3NhZ2UodG9rZW4sIFwiKlwiKTtcbiAgICB9XG4gIH0pKGBheGlvc0Ake01hdGgucmFuZG9tKCl9YCwgW10pIDogKGNiKSA9PiBzZXRUaW1lb3V0KGNiKTtcbn0pKFxuICB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nLFxuICBpc0Z1bmN0aW9uKF9nbG9iYWwucG9zdE1lc3NhZ2UpXG4pO1xuXG5jb25zdCBhc2FwID0gdHlwZW9mIHF1ZXVlTWljcm90YXNrICE9PSAndW5kZWZpbmVkJyA/XG4gIHF1ZXVlTWljcm90YXNrLmJpbmQoX2dsb2JhbCkgOiAoIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLm5leHRUaWNrIHx8IF9zZXRJbW1lZGlhdGUpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKipcblxuZXhwb3J0IGRlZmF1bHQge1xuICBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nLFxuICBpc051bWJlcixcbiAgaXNCb29sZWFuLFxuICBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdCxcbiAgaXNSZWFkYWJsZVN0cmVhbSxcbiAgaXNSZXF1ZXN0LFxuICBpc1Jlc3BvbnNlLFxuICBpc0hlYWRlcnMsXG4gIGlzVW5kZWZpbmVkLFxuICBpc0RhdGUsXG4gIGlzRmlsZSxcbiAgaXNCbG9iLFxuICBpc1JlZ0V4cCxcbiAgaXNGdW5jdGlvbixcbiAgaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1R5cGVkQXJyYXksXG4gIGlzRmlsZUxpc3QsXG4gIGZvckVhY2gsXG4gIG1lcmdlLFxuICBleHRlbmQsXG4gIHRyaW0sXG4gIHN0cmlwQk9NLFxuICBpbmhlcml0cyxcbiAgdG9GbGF0T2JqZWN0LFxuICBraW5kT2YsXG4gIGtpbmRPZlRlc3QsXG4gIGVuZHNXaXRoLFxuICB0b0FycmF5LFxuICBmb3JFYWNoRW50cnksXG4gIG1hdGNoQWxsLFxuICBpc0hUTUxGb3JtLFxuICBoYXNPd25Qcm9wZXJ0eSxcbiAgaGFzT3duUHJvcDogaGFzT3duUHJvcGVydHksIC8vIGFuIGFsaWFzIHRvIGF2b2lkIEVTTGludCBuby1wcm90b3R5cGUtYnVpbHRpbnMgZGV0ZWN0aW9uXG4gIHJlZHVjZURlc2NyaXB0b3JzLFxuICBmcmVlemVNZXRob2RzLFxuICB0b09iamVjdFNldCxcbiAgdG9DYW1lbENhc2UsXG4gIG5vb3AsXG4gIHRvRmluaXRlTnVtYmVyLFxuICBmaW5kS2V5LFxuICBnbG9iYWw6IF9nbG9iYWwsXG4gIGlzQ29udGV4dERlZmluZWQsXG4gIEFMUEhBQkVULFxuICBnZW5lcmF0ZVN0cmluZyxcbiAgaXNTcGVjQ29tcGxpYW50Rm9ybSxcbiAgdG9KU09OT2JqZWN0LFxuICBpc0FzeW5jRm4sXG4gIGlzVGhlbmFibGUsXG4gIHNldEltbWVkaWF0ZTogX3NldEltbWVkaWF0ZSxcbiAgYXNhcFxufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXSBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5mdW5jdGlvbiBBeGlvc0Vycm9yKG1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgRXJyb3IuY2FsbCh0aGlzKTtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgfVxuXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMubmFtZSA9ICdBeGlvc0Vycm9yJztcbiAgY29kZSAmJiAodGhpcy5jb2RlID0gY29kZSk7XG4gIGNvbmZpZyAmJiAodGhpcy5jb25maWcgPSBjb25maWcpO1xuICByZXF1ZXN0ICYmICh0aGlzLnJlcXVlc3QgPSByZXF1ZXN0KTtcbiAgaWYgKHJlc3BvbnNlKSB7XG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgIHRoaXMuc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzID8gcmVzcG9uc2Uuc3RhdHVzIDogbnVsbDtcbiAgfVxufVxuXG51dGlscy5pbmhlcml0cyhBeGlvc0Vycm9yLCBFcnJvciwge1xuICB0b0pTT046IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB1dGlscy50b0pTT05PYmplY3QodGhpcy5jb25maWcpLFxuICAgICAgY29kZTogdGhpcy5jb2RlLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1c1xuICAgIH07XG4gIH1cbn0pO1xuXG5jb25zdCBwcm90b3R5cGUgPSBBeGlvc0Vycm9yLnByb3RvdHlwZTtcbmNvbnN0IGRlc2NyaXB0b3JzID0ge307XG5cbltcbiAgJ0VSUl9CQURfT1BUSU9OX1ZBTFVFJyxcbiAgJ0VSUl9CQURfT1BUSU9OJyxcbiAgJ0VDT05OQUJPUlRFRCcsXG4gICdFVElNRURPVVQnLFxuICAnRVJSX05FVFdPUksnLFxuICAnRVJSX0ZSX1RPT19NQU5ZX1JFRElSRUNUUycsXG4gICdFUlJfREVQUkVDQVRFRCcsXG4gICdFUlJfQkFEX1JFU1BPTlNFJyxcbiAgJ0VSUl9CQURfUkVRVUVTVCcsXG4gICdFUlJfQ0FOQ0VMRUQnLFxuICAnRVJSX05PVF9TVVBQT1JUJyxcbiAgJ0VSUl9JTlZBTElEX1VSTCdcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5dLmZvckVhY2goY29kZSA9PiB7XG4gIGRlc2NyaXB0b3JzW2NvZGVdID0ge3ZhbHVlOiBjb2RlfTtcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhBeGlvc0Vycm9yLCBkZXNjcmlwdG9ycyk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG90eXBlLCAnaXNBeGlvc0Vycm9yJywge3ZhbHVlOiB0cnVlfSk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5BeGlvc0Vycm9yLmZyb20gPSAoZXJyb3IsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UsIGN1c3RvbVByb3BzKSA9PiB7XG4gIGNvbnN0IGF4aW9zRXJyb3IgPSBPYmplY3QuY3JlYXRlKHByb3RvdHlwZSk7XG5cbiAgdXRpbHMudG9GbGF0T2JqZWN0KGVycm9yLCBheGlvc0Vycm9yLCBmdW5jdGlvbiBmaWx0ZXIob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gRXJyb3IucHJvdG90eXBlO1xuICB9LCBwcm9wID0+IHtcbiAgICByZXR1cm4gcHJvcCAhPT0gJ2lzQXhpb3NFcnJvcic7XG4gIH0pO1xuXG4gIEF4aW9zRXJyb3IuY2FsbChheGlvc0Vycm9yLCBlcnJvci5tZXNzYWdlLCBjb2RlLCBjb25maWcsIHJlcXVlc3QsIHJlc3BvbnNlKTtcblxuICBheGlvc0Vycm9yLmNhdXNlID0gZXJyb3I7XG5cbiAgYXhpb3NFcnJvci5uYW1lID0gZXJyb3IubmFtZTtcblxuICBjdXN0b21Qcm9wcyAmJiBPYmplY3QuYXNzaWduKGF4aW9zRXJyb3IsIGN1c3RvbVByb3BzKTtcblxuICByZXR1cm4gYXhpb3NFcnJvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zRXJyb3I7XG4iLCAiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHN0cmljdFxuZXhwb3J0IGRlZmF1bHQgbnVsbDtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuLy8gdGVtcG9yYXJ5IGhvdGZpeCB0byBhdm9pZCBjaXJjdWxhciByZWZlcmVuY2VzIHVudGlsIEF4aW9zVVJMU2VhcmNoUGFyYW1zIGlzIHJlZmFjdG9yZWRcbmltcG9ydCBQbGF0Zm9ybUZvcm1EYXRhIGZyb20gJy4uL3BsYXRmb3JtL25vZGUvY2xhc3Nlcy9Gb3JtRGF0YS5qcyc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgZ2l2ZW4gdGhpbmcgaXMgYSBhcnJheSBvciBqcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoaW5nIC0gVGhlIG9iamVjdCBvciBhcnJheSB0byBiZSB2aXNpdGVkLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1Zpc2l0YWJsZSh0aGluZykge1xuICByZXR1cm4gdXRpbHMuaXNQbGFpbk9iamVjdCh0aGluZykgfHwgdXRpbHMuaXNBcnJheSh0aGluZyk7XG59XG5cbi8qKlxuICogSXQgcmVtb3ZlcyB0aGUgYnJhY2tldHMgZnJvbSB0aGUgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgb2YgdGhlIHBhcmFtZXRlci5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUga2V5IHdpdGhvdXQgdGhlIGJyYWNrZXRzLlxuICovXG5mdW5jdGlvbiByZW1vdmVCcmFja2V0cyhrZXkpIHtcbiAgcmV0dXJuIHV0aWxzLmVuZHNXaXRoKGtleSwgJ1tdJykgPyBrZXkuc2xpY2UoMCwgLTIpIDoga2V5O1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgcGF0aCwgYSBrZXksIGFuZCBhIGJvb2xlYW4sIGFuZCByZXR1cm5zIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgY3VycmVudCBrZXkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSBvZiB0aGUgY3VycmVudCBvYmplY3QgYmVpbmcgaXRlcmF0ZWQgb3Zlci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkb3RzIC0gSWYgdHJ1ZSwgdGhlIGtleSB3aWxsIGJlIHJlbmRlcmVkIHdpdGggZG90cyBpbnN0ZWFkIG9mIGJyYWNrZXRzLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBwYXRoIHRvIHRoZSBjdXJyZW50IGtleS5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyS2V5KHBhdGgsIGtleSwgZG90cykge1xuICBpZiAoIXBhdGgpIHJldHVybiBrZXk7XG4gIHJldHVybiBwYXRoLmNvbmNhdChrZXkpLm1hcChmdW5jdGlvbiBlYWNoKHRva2VuLCBpKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgdG9rZW4gPSByZW1vdmVCcmFja2V0cyh0b2tlbik7XG4gICAgcmV0dXJuICFkb3RzICYmIGkgPyAnWycgKyB0b2tlbiArICddJyA6IHRva2VuO1xuICB9KS5qb2luKGRvdHMgPyAnLicgOiAnJyk7XG59XG5cbi8qKlxuICogSWYgdGhlIGFycmF5IGlzIGFuIGFycmF5IGFuZCBub25lIG9mIGl0cyBlbGVtZW50cyBhcmUgdmlzaXRhYmxlLCB0aGVuIGl0J3MgYSBmbGF0IGFycmF5LlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8YW55Pn0gYXJyIC0gVGhlIGFycmF5IHRvIGNoZWNrXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxhdEFycmF5KGFycikge1xuICByZXR1cm4gdXRpbHMuaXNBcnJheShhcnIpICYmICFhcnIuc29tZShpc1Zpc2l0YWJsZSk7XG59XG5cbmNvbnN0IHByZWRpY2F0ZXMgPSB1dGlscy50b0ZsYXRPYmplY3QodXRpbHMsIHt9LCBudWxsLCBmdW5jdGlvbiBmaWx0ZXIocHJvcCkge1xuICByZXR1cm4gL15pc1tBLVpdLy50ZXN0KHByb3ApO1xufSk7XG5cbi8qKlxuICogQ29udmVydCBhIGRhdGEgb2JqZWN0IHRvIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHs/T2JqZWN0fSBbZm9ybURhdGFdXG4gKiBAcGFyYW0gez9PYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMudmlzaXRvcl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubWV0YVRva2VucyA9IHRydWVdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmRvdHMgPSBmYWxzZV1cbiAqIEBwYXJhbSB7P0Jvb2xlYW59IFtvcHRpb25zLmluZGV4ZXMgPSBmYWxzZV1cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICoqL1xuXG4vKipcbiAqIEl0IGNvbnZlcnRzIGFuIG9iamVjdCBpbnRvIGEgRm9ybURhdGEgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3Q8YW55LCBhbnk+fSBvYmogLSBUaGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gZm9ybSBkYXRhLlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1EYXRhIC0gVGhlIEZvcm1EYXRhIG9iamVjdCB0byBhcHBlbmQgdG8uXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IG9wdGlvbnNcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiB0b0Zvcm1EYXRhKG9iaiwgZm9ybURhdGEsIG9wdGlvbnMpIHtcbiAgaWYgKCF1dGlscy5pc09iamVjdChvYmopKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0IG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgZm9ybURhdGEgPSBmb3JtRGF0YSB8fCBuZXcgKFBsYXRmb3JtRm9ybURhdGEgfHwgRm9ybURhdGEpKCk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIG9wdGlvbnMgPSB1dGlscy50b0ZsYXRPYmplY3Qob3B0aW9ucywge1xuICAgIG1ldGFUb2tlbnM6IHRydWUsXG4gICAgZG90czogZmFsc2UsXG4gICAgaW5kZXhlczogZmFsc2VcbiAgfSwgZmFsc2UsIGZ1bmN0aW9uIGRlZmluZWQob3B0aW9uLCBzb3VyY2UpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgICByZXR1cm4gIXV0aWxzLmlzVW5kZWZpbmVkKHNvdXJjZVtvcHRpb25dKTtcbiAgfSk7XG5cbiAgY29uc3QgbWV0YVRva2VucyA9IG9wdGlvbnMubWV0YVRva2VucztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXG4gIGNvbnN0IHZpc2l0b3IgPSBvcHRpb25zLnZpc2l0b3IgfHwgZGVmYXVsdFZpc2l0b3I7XG4gIGNvbnN0IGRvdHMgPSBvcHRpb25zLmRvdHM7XG4gIGNvbnN0IGluZGV4ZXMgPSBvcHRpb25zLmluZGV4ZXM7XG4gIGNvbnN0IF9CbG9iID0gb3B0aW9ucy5CbG9iIHx8IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBCbG9iO1xuICBjb25zdCB1c2VCbG9iID0gX0Jsb2IgJiYgdXRpbHMuaXNTcGVjQ29tcGxpYW50Rm9ybShmb3JtRGF0YSk7XG5cbiAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKHZpc2l0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmlzaXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuICcnO1xuXG4gICAgaWYgKHV0aWxzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmICghdXNlQmxvYiAmJiB1dGlscy5pc0Jsb2IodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignQmxvYiBpcyBub3Qgc3VwcG9ydGVkLiBVc2UgYSBCdWZmZXIgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlcih2YWx1ZSkgfHwgdXRpbHMuaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHVzZUJsb2IgJiYgdHlwZW9mIEJsb2IgPT09ICdmdW5jdGlvbicgPyBuZXcgQmxvYihbdmFsdWVdKSA6IEJ1ZmZlci5mcm9tKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogRGVmYXVsdCB2aXNpdG9yLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0ga2V5XG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nfE51bWJlcj59IHBhdGhcbiAgICogQHRoaXMge0Zvcm1EYXRhfVxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgdG8gdmlzaXQgdGhlIGVhY2ggcHJvcCBvZiB0aGUgdmFsdWUgcmVjdXJzaXZlbHlcbiAgICovXG4gIGZ1bmN0aW9uIGRlZmF1bHRWaXNpdG9yKHZhbHVlLCBrZXksIHBhdGgpIHtcbiAgICBsZXQgYXJyID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUgJiYgIXBhdGggJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHV0aWxzLmVuZHNXaXRoKGtleSwgJ3t9JykpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGtleSA9IG1ldGFUb2tlbnMgPyBrZXkgOiBrZXkuc2xpY2UoMCwgLTIpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAodXRpbHMuaXNBcnJheSh2YWx1ZSkgJiYgaXNGbGF0QXJyYXkodmFsdWUpKSB8fFxuICAgICAgICAoKHV0aWxzLmlzRmlsZUxpc3QodmFsdWUpIHx8IHV0aWxzLmVuZHNXaXRoKGtleSwgJ1tdJykpICYmIChhcnIgPSB1dGlscy50b0FycmF5KHZhbHVlKSlcbiAgICAgICAgKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAga2V5ID0gcmVtb3ZlQnJhY2tldHMoa2V5KTtcblxuICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiBlYWNoKGVsLCBpbmRleCkge1xuICAgICAgICAgICEodXRpbHMuaXNVbmRlZmluZWQoZWwpIHx8IGVsID09PSBudWxsKSAmJiBmb3JtRGF0YS5hcHBlbmQoXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcbiAgICAgICAgICAgIGluZGV4ZXMgPT09IHRydWUgPyByZW5kZXJLZXkoW2tleV0sIGluZGV4LCBkb3RzKSA6IChpbmRleGVzID09PSBudWxsID8ga2V5IDoga2V5ICsgJ1tdJyksXG4gICAgICAgICAgICBjb252ZXJ0VmFsdWUoZWwpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNWaXNpdGFibGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3JtRGF0YS5hcHBlbmQocmVuZGVyS2V5KHBhdGgsIGtleSwgZG90cyksIGNvbnZlcnRWYWx1ZSh2YWx1ZSkpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc3RhY2sgPSBbXTtcblxuICBjb25zdCBleHBvc2VkSGVscGVycyA9IE9iamVjdC5hc3NpZ24ocHJlZGljYXRlcywge1xuICAgIGRlZmF1bHRWaXNpdG9yLFxuICAgIGNvbnZlcnRWYWx1ZSxcbiAgICBpc1Zpc2l0YWJsZVxuICB9KTtcblxuICBmdW5jdGlvbiBidWlsZCh2YWx1ZSwgcGF0aCkge1xuICAgIGlmICh1dGlscy5pc1VuZGVmaW5lZCh2YWx1ZSkpIHJldHVybjtcblxuICAgIGlmIChzdGFjay5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IEVycm9yKCdDaXJjdWxhciByZWZlcmVuY2UgZGV0ZWN0ZWQgaW4gJyArIHBhdGguam9pbignLicpKTtcbiAgICB9XG5cbiAgICBzdGFjay5wdXNoKHZhbHVlKTtcblxuICAgIHV0aWxzLmZvckVhY2godmFsdWUsIGZ1bmN0aW9uIGVhY2goZWwsIGtleSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gISh1dGlscy5pc1VuZGVmaW5lZChlbCkgfHwgZWwgPT09IG51bGwpICYmIHZpc2l0b3IuY2FsbChcbiAgICAgICAgZm9ybURhdGEsIGVsLCB1dGlscy5pc1N0cmluZyhrZXkpID8ga2V5LnRyaW0oKSA6IGtleSwgcGF0aCwgZXhwb3NlZEhlbHBlcnNcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgYnVpbGQoZWwsIHBhdGggPyBwYXRoLmNvbmNhdChrZXkpIDogW2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc3RhY2sucG9wKCk7XG4gIH1cblxuICBpZiAoIXV0aWxzLmlzT2JqZWN0KG9iaikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdkYXRhIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cblxuICBidWlsZChvYmopO1xuXG4gIHJldHVybiBmb3JtRGF0YTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9Gb3JtRGF0YTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4vdG9Gb3JtRGF0YS5qcyc7XG5cbi8qKlxuICogSXQgZW5jb2RlcyBhIHN0cmluZyBieSByZXBsYWNpbmcgYWxsIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IGluIHRoZSB1bnJlc2VydmVkIHNldCB3aXRoXG4gKiB0aGVpciBwZXJjZW50LWVuY29kZWQgZXF1aXZhbGVudHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBlbmNvZGUuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGVuY29kZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBlbmNvZGUoc3RyKSB7XG4gIGNvbnN0IGNoYXJNYXAgPSB7XG4gICAgJyEnOiAnJTIxJyxcbiAgICBcIidcIjogJyUyNycsXG4gICAgJygnOiAnJTI4JyxcbiAgICAnKSc6ICclMjknLFxuICAgICd+JzogJyU3RScsXG4gICAgJyUyMCc6ICcrJyxcbiAgICAnJTAwJzogJ1xceDAwJ1xuICB9O1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCl+XXwlMjB8JTAwL2csIGZ1bmN0aW9uIHJlcGxhY2VyKG1hdGNoKSB7XG4gICAgcmV0dXJuIGNoYXJNYXBbbWF0Y2hdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHBhcmFtcyBvYmplY3QgYW5kIGNvbnZlcnRzIGl0IHRvIGEgRm9ybURhdGEgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBGb3JtRGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBvYmplY3QgcGFzc2VkIHRvIHRoZSBBeGlvcyBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKSB7XG4gIHRoaXMuX3BhaXJzID0gW107XG5cbiAgcGFyYW1zICYmIHRvRm9ybURhdGEocGFyYW1zLCB0aGlzLCBvcHRpb25zKTtcbn1cblxuY29uc3QgcHJvdG90eXBlID0gQXhpb3NVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlO1xuXG5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gYXBwZW5kKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX3BhaXJzLnB1c2goW25hbWUsIHZhbHVlXSk7XG59O1xuXG5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhlbmNvZGVyKSB7XG4gIGNvbnN0IF9lbmNvZGUgPSBlbmNvZGVyID8gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2Rlci5jYWxsKHRoaXMsIHZhbHVlLCBlbmNvZGUpO1xuICB9IDogZW5jb2RlO1xuXG4gIHJldHVybiB0aGlzLl9wYWlycy5tYXAoZnVuY3Rpb24gZWFjaChwYWlyKSB7XG4gICAgcmV0dXJuIF9lbmNvZGUocGFpclswXSkgKyAnPScgKyBfZW5jb2RlKHBhaXJbMV0pO1xuICB9LCAnJykuam9pbignJicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4uL2hlbHBlcnMvQXhpb3NVUkxTZWFyY2hQYXJhbXMuanMnO1xuXG4vKipcbiAqIEl0IHJlcGxhY2VzIGFsbCBpbnN0YW5jZXMgb2YgdGhlIGNoYXJhY3RlcnMgYDpgLCBgJGAsIGAsYCwgYCtgLCBgW2AsIGFuZCBgXWAgd2l0aCB0aGVpclxuICogVVJJIGVuY29kZWQgY291bnRlcnBhcnRzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbCBUaGUgdmFsdWUgdG8gYmUgZW5jb2RlZC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZW5jb2RlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEBwYXJhbSB7P29iamVjdH0gb3B0aW9uc1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBvcHRpb25zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgXG4gIGNvbnN0IF9lbmNvZGUgPSBvcHRpb25zICYmIG9wdGlvbnMuZW5jb2RlIHx8IGVuY29kZTtcblxuICBjb25zdCBzZXJpYWxpemVGbiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zZXJpYWxpemU7XG5cbiAgbGV0IHNlcmlhbGl6ZWRQYXJhbXM7XG5cbiAgaWYgKHNlcmlhbGl6ZUZuKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHNlcmlhbGl6ZUZuKHBhcmFtcywgb3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykgP1xuICAgICAgcGFyYW1zLnRvU3RyaW5nKCkgOlxuICAgICAgbmV3IEF4aW9zVVJMU2VhcmNoUGFyYW1zKHBhcmFtcywgb3B0aW9ucykudG9TdHJpbmcoX2VuY29kZSk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIGNvbnN0IGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZihcIiNcIik7XG5cbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcblxuY2xhc3MgSW50ZXJjZXB0b3JNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gICAqL1xuICB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICAgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgICBmdWxmaWxsZWQsXG4gICAgICByZWplY3RlZCxcbiAgICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgICAgcnVuV2hlbjogb3B0aW9ucyA/IG9wdGlvbnMucnVuV2hlbiA6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGludGVyY2VwdG9yIHdhcyByZW1vdmVkLCBgZmFsc2VgIG90aGVyd2lzZVxuICAgKi9cbiAgZWplY3QoaWQpIHtcbiAgICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIGludGVyY2VwdG9ycyBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLmhhbmRsZXJzKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gICAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZvckVhY2goZm4pIHtcbiAgICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICAgIGZuKGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsICIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc1VSTFNlYXJjaFBhcmFtcyBmcm9tICcuLi8uLi8uLi9oZWxwZXJzL0F4aW9zVVJMU2VhcmNoUGFyYW1zLmpzJztcbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnID8gVVJMU2VhcmNoUGFyYW1zIDogQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnID8gRm9ybURhdGEgOiBudWxsO1xuIiwgIid1c2Ugc3RyaWN0J1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgPyBCbG9iIDogbnVsbFxuIiwgImltcG9ydCBVUkxTZWFyY2hQYXJhbXMgZnJvbSAnLi9jbGFzc2VzL1VSTFNlYXJjaFBhcmFtcy5qcydcbmltcG9ydCBGb3JtRGF0YSBmcm9tICcuL2NsYXNzZXMvRm9ybURhdGEuanMnXG5pbXBvcnQgQmxvYiBmcm9tICcuL2NsYXNzZXMvQmxvYi5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBpc0Jyb3dzZXI6IHRydWUsXG4gIGNsYXNzZXM6IHtcbiAgICBVUkxTZWFyY2hQYXJhbXMsXG4gICAgRm9ybURhdGEsXG4gICAgQmxvYlxuICB9LFxuICBwcm90b2NvbHM6IFsnaHR0cCcsICdodHRwcycsICdmaWxlJywgJ2Jsb2InLCAndXJsJywgJ2RhdGEnXVxufTtcbiIsICJjb25zdCBoYXNCcm93c2VyRW52ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcblxuY29uc3QgX25hdmlnYXRvciA9IHR5cGVvZiBuYXZpZ2F0b3IgPT09ICdvYmplY3QnICYmIG5hdmlnYXRvciB8fCB1bmRlZmluZWQ7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBoYXNTdGFuZGFyZEJyb3dzZXJFbnYgPSBoYXNCcm93c2VyRW52ICYmXG4gICghX25hdmlnYXRvciB8fCBbJ1JlYWN0TmF0aXZlJywgJ05hdGl2ZVNjcmlwdCcsICdOUyddLmluZGV4T2YoX25hdmlnYXRvci5wcm9kdWN0KSA8IDApO1xuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciB3ZWJXb3JrZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBBbHRob3VnaCB0aGUgYGlzU3RhbmRhcmRCcm93c2VyRW52YCBtZXRob2QgaW5kaWNhdGVzIHRoYXRcbiAqIGBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlcmAsIHRoZSBXZWJXb3JrZXIgd2lsbCBzdGlsbCBiZVxuICogZmlsdGVyZWQgb3V0IGR1ZSB0byBpdHMganVkZ21lbnQgc3RhbmRhcmRcbiAqIGB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnYC5cbiAqIFRoaXMgbGVhZHMgdG8gYSBwcm9ibGVtIHdoZW4gYXhpb3MgcG9zdCBgRm9ybURhdGFgIGluIHdlYldvcmtlclxuICovXG5jb25zdCBoYXNTdGFuZGFyZEJyb3dzZXJXZWJXb3JrZXJFbnYgPSAoKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUgJiZcbiAgICB0eXBlb2Ygc2VsZi5pbXBvcnRTY3JpcHRzID09PSAnZnVuY3Rpb24nXG4gICk7XG59KSgpO1xuXG5jb25zdCBvcmlnaW4gPSBoYXNCcm93c2VyRW52ICYmIHdpbmRvdy5sb2NhdGlvbi5ocmVmIHx8ICdodHRwOi8vbG9jYWxob3N0JztcblxuZXhwb3J0IHtcbiAgaGFzQnJvd3NlckVudixcbiAgaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52LFxuICBoYXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIF9uYXZpZ2F0b3IgYXMgbmF2aWdhdG9yLFxuICBvcmlnaW5cbn1cbiIsICJpbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi9ub2RlL2luZGV4LmpzJztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vY29tbW9uL3V0aWxzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAuLi51dGlscyxcbiAgLi4ucGxhdGZvcm1cbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuL3RvRm9ybURhdGEuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9VUkxFbmNvZGVkRm9ybShkYXRhLCBvcHRpb25zKSB7XG4gIHJldHVybiB0b0Zvcm1EYXRhKGRhdGEsIG5ldyBwbGF0Zm9ybS5jbGFzc2VzLlVSTFNlYXJjaFBhcmFtcygpLCBPYmplY3QuYXNzaWduKHtcbiAgICB2aXNpdG9yOiBmdW5jdGlvbih2YWx1ZSwga2V5LCBwYXRoLCBoZWxwZXJzKSB7XG4gICAgICBpZiAocGxhdGZvcm0uaXNOb2RlICYmIHV0aWxzLmlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgICB0aGlzLmFwcGVuZChrZXksIHZhbHVlLnRvU3RyaW5nKCdiYXNlNjQnKSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhlbHBlcnMuZGVmYXVsdFZpc2l0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sIG9wdGlvbnMpKTtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogSXQgdGFrZXMgYSBzdHJpbmcgbGlrZSBgZm9vW3hdW3ldW3pdYCBhbmQgcmV0dXJucyBhbiBhcnJheSBsaWtlIGBbJ2ZvbycsICd4JywgJ3knLCAneiddXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICpcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlUHJvcFBhdGgobmFtZSkge1xuICAvLyBmb29beF1beV1bel1cbiAgLy8gZm9vLngueS56XG4gIC8vIGZvby14LXktelxuICAvLyBmb28geCB5IHpcbiAgcmV0dXJuIHV0aWxzLm1hdGNoQWxsKC9cXHcrfFxcWyhcXHcqKV0vZywgbmFtZSkubWFwKG1hdGNoID0+IHtcbiAgICByZXR1cm4gbWF0Y2hbMF0gPT09ICdbXScgPyAnJyA6IG1hdGNoWzFdIHx8IG1hdGNoWzBdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIGFycmF5IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGFyciAtIFRoZSBhcnJheSB0byBjb252ZXJ0IHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFuZCB2YWx1ZXMgYXMgdGhlIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheVRvT2JqZWN0KGFycikge1xuICBjb25zdCBvYmogPSB7fTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gIGxldCBpO1xuICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgbGV0IGtleTtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICBvYmpba2V5XSA9IGFycltrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBGb3JtRGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBKYXZhU2NyaXB0IG9iamVjdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtRGF0YSBUaGUgRm9ybURhdGEgb2JqZWN0IHRvIGNvbnZlcnQgdG8gSlNPTi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0PHN0cmluZywgYW55PiB8IG51bGx9IFRoZSBjb252ZXJ0ZWQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBmb3JtRGF0YVRvSlNPTihmb3JtRGF0YSkge1xuICBmdW5jdGlvbiBidWlsZFBhdGgocGF0aCwgdmFsdWUsIHRhcmdldCwgaW5kZXgpIHtcbiAgICBsZXQgbmFtZSA9IHBhdGhbaW5kZXgrK107XG5cbiAgICBpZiAobmFtZSA9PT0gJ19fcHJvdG9fXycpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3QgaXNOdW1lcmljS2V5ID0gTnVtYmVyLmlzRmluaXRlKCtuYW1lKTtcbiAgICBjb25zdCBpc0xhc3QgPSBpbmRleCA+PSBwYXRoLmxlbmd0aDtcbiAgICBuYW1lID0gIW5hbWUgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXQpID8gdGFyZ2V0Lmxlbmd0aCA6IG5hbWU7XG5cbiAgICBpZiAoaXNMYXN0KSB7XG4gICAgICBpZiAodXRpbHMuaGFzT3duUHJvcCh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IFt0YXJnZXRbbmFtZV0sIHZhbHVlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gIWlzTnVtZXJpY0tleTtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldFtuYW1lXSB8fCAhdXRpbHMuaXNPYmplY3QodGFyZ2V0W25hbWVdKSkge1xuICAgICAgdGFyZ2V0W25hbWVdID0gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYnVpbGRQYXRoKHBhdGgsIHZhbHVlLCB0YXJnZXRbbmFtZV0sIGluZGV4KTtcblxuICAgIGlmIChyZXN1bHQgJiYgdXRpbHMuaXNBcnJheSh0YXJnZXRbbmFtZV0pKSB7XG4gICAgICB0YXJnZXRbbmFtZV0gPSBhcnJheVRvT2JqZWN0KHRhcmdldFtuYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICFpc051bWVyaWNLZXk7XG4gIH1cblxuICBpZiAodXRpbHMuaXNGb3JtRGF0YShmb3JtRGF0YSkgJiYgdXRpbHMuaXNGdW5jdGlvbihmb3JtRGF0YS5lbnRyaWVzKSkge1xuICAgIGNvbnN0IG9iaiA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaEVudHJ5KGZvcm1EYXRhLCAobmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGJ1aWxkUGF0aChwYXJzZVByb3BQYXRoKG5hbWUpLCB2YWx1ZSwgb2JqLCAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9ybURhdGFUb0pTT047XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbmltcG9ydCB0cmFuc2l0aW9uYWxEZWZhdWx0cyBmcm9tICcuL3RyYW5zaXRpb25hbC5qcyc7XG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuLi9oZWxwZXJzL3RvRm9ybURhdGEuanMnO1xuaW1wb3J0IHRvVVJMRW5jb2RlZEZvcm0gZnJvbSAnLi4vaGVscGVycy90b1VSTEVuY29kZWRGb3JtLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgZm9ybURhdGFUb0pTT04gZnJvbSAnLi4vaGVscGVycy9mb3JtRGF0YVRvSlNPTi5qcyc7XG5cbi8qKlxuICogSXQgdGFrZXMgYSBzdHJpbmcsIHRyaWVzIHRvIHBhcnNlIGl0LCBhbmQgaWYgaXQgZmFpbHMsIGl0IHJldHVybnMgdGhlIHN0cmluZ2lmaWVkIHZlcnNpb25cbiAqIG9mIHRoZSBpbnB1dFxuICpcbiAqIEBwYXJhbSB7YW55fSByYXdWYWx1ZSAtIFRoZSB2YWx1ZSB0byBiZSBzdHJpbmdpZmllZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHBhcnNlciAtIEEgZnVuY3Rpb24gdGhhdCBwYXJzZXMgYSBzdHJpbmcgaW50byBhIEphdmFTY3JpcHQgb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZW5jb2RlciAtIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHZhbHVlIGFuZCByZXR1cm5zIGEgc3RyaW5nLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5naWZpZWQgdmVyc2lvbiBvZiB0aGUgcmF3VmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ2lmeVNhZmVseShyYXdWYWx1ZSwgcGFyc2VyLCBlbmNvZGVyKSB7XG4gIGlmICh1dGlscy5pc1N0cmluZyhyYXdWYWx1ZSkpIHtcbiAgICB0cnkge1xuICAgICAgKHBhcnNlciB8fCBKU09OLnBhcnNlKShyYXdWYWx1ZSk7XG4gICAgICByZXR1cm4gdXRpbHMudHJpbShyYXdWYWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubmFtZSAhPT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoZW5jb2RlciB8fCBKU09OLnN0cmluZ2lmeSkocmF3VmFsdWUpO1xufVxuXG5jb25zdCBkZWZhdWx0cyA9IHtcblxuICB0cmFuc2l0aW9uYWw6IHRyYW5zaXRpb25hbERlZmF1bHRzLFxuXG4gIGFkYXB0ZXI6IFsneGhyJywgJ2h0dHAnLCAnZmV0Y2gnXSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgY29uc3QgY29udGVudFR5cGUgPSBoZWFkZXJzLmdldENvbnRlbnRUeXBlKCkgfHwgJyc7XG4gICAgY29uc3QgaGFzSlNPTkNvbnRlbnRUeXBlID0gY29udGVudFR5cGUuaW5kZXhPZignYXBwbGljYXRpb24vanNvbicpID4gLTE7XG4gICAgY29uc3QgaXNPYmplY3RQYXlsb2FkID0gdXRpbHMuaXNPYmplY3QoZGF0YSk7XG5cbiAgICBpZiAoaXNPYmplY3RQYXlsb2FkICYmIHV0aWxzLmlzSFRNTEZvcm0oZGF0YSkpIHtcbiAgICAgIGRhdGEgPSBuZXcgRm9ybURhdGEoZGF0YSk7XG4gICAgfVxuXG4gICAgY29uc3QgaXNGb3JtRGF0YSA9IHV0aWxzLmlzRm9ybURhdGEoZGF0YSk7XG5cbiAgICBpZiAoaXNGb3JtRGF0YSkge1xuICAgICAgcmV0dXJuIGhhc0pTT05Db250ZW50VHlwZSA/IEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhVG9KU09OKGRhdGEpKSA6IGRhdGE7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzUmVhZGFibGVTdHJlYW0oZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcsIGZhbHNlKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbGV0IGlzRmlsZUxpc3Q7XG5cbiAgICBpZiAoaXNPYmplY3RQYXlsb2FkKSB7XG4gICAgICBpZiAoY29udGVudFR5cGUuaW5kZXhPZignYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykgPiAtMSkge1xuICAgICAgICByZXR1cm4gdG9VUkxFbmNvZGVkRm9ybShkYXRhLCB0aGlzLmZvcm1TZXJpYWxpemVyKS50b1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGlzRmlsZUxpc3QgPSB1dGlscy5pc0ZpbGVMaXN0KGRhdGEpKSB8fCBjb250ZW50VHlwZS5pbmRleE9mKCdtdWx0aXBhcnQvZm9ybS1kYXRhJykgPiAtMSkge1xuICAgICAgICBjb25zdCBfRm9ybURhdGEgPSB0aGlzLmVudiAmJiB0aGlzLmVudi5Gb3JtRGF0YTtcblxuICAgICAgICByZXR1cm4gdG9Gb3JtRGF0YShcbiAgICAgICAgICBpc0ZpbGVMaXN0ID8geydmaWxlc1tdJzogZGF0YX0gOiBkYXRhLFxuICAgICAgICAgIF9Gb3JtRGF0YSAmJiBuZXcgX0Zvcm1EYXRhKCksXG4gICAgICAgICAgdGhpcy5mb3JtU2VyaWFsaXplclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc09iamVjdFBheWxvYWQgfHwgaGFzSlNPTkNvbnRlbnRUeXBlICkge1xuICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24vanNvbicsIGZhbHNlKTtcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTYWZlbHkoZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIGNvbnN0IHRyYW5zaXRpb25hbCA9IHRoaXMudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICBjb25zdCBmb3JjZWRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuZm9yY2VkSlNPTlBhcnNpbmc7XG4gICAgY29uc3QgSlNPTlJlcXVlc3RlZCA9IHRoaXMucmVzcG9uc2VUeXBlID09PSAnanNvbic7XG5cbiAgICBpZiAodXRpbHMuaXNSZXNwb25zZShkYXRhKSB8fCB1dGlscy5pc1JlYWRhYmxlU3RyZWFtKGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSAmJiB1dGlscy5pc1N0cmluZyhkYXRhKSAmJiAoKGZvcmNlZEpTT05QYXJzaW5nICYmICF0aGlzLnJlc3BvbnNlVHlwZSkgfHwgSlNPTlJlcXVlc3RlZCkpIHtcbiAgICAgIGNvbnN0IHNpbGVudEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5zaWxlbnRKU09OUGFyc2luZztcbiAgICAgIGNvbnN0IHN0cmljdEpTT05QYXJzaW5nID0gIXNpbGVudEpTT05QYXJzaW5nICYmIEpTT05SZXF1ZXN0ZWQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcpIHtcbiAgICAgICAgICBpZiAoZS5uYW1lID09PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgICAgICB0aHJvdyBBeGlvc0Vycm9yLmZyb20oZSwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFLCB0aGlzLCBudWxsLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgZW52OiB7XG4gICAgRm9ybURhdGE6IHBsYXRmb3JtLmNsYXNzZXMuRm9ybURhdGEsXG4gICAgQmxvYjogcGxhdGZvcm0uY2xhc3Nlcy5CbG9iXG4gIH0sXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfSxcblxuICBoZWFkZXJzOiB7XG4gICAgY29tbW9uOiB7XG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKicsXG4gICAgICAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkXG4gICAgfVxuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIChtZXRob2QpID0+IHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdHM7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbi8vIFJhd0F4aW9zSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbmNvbnN0IGlnbm9yZUR1cGxpY2F0ZU9mID0gdXRpbHMudG9PYmplY3RTZXQoW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl0pO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmF3SGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKlxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgcmF3SGVhZGVycyA9PiB7XG4gIGNvbnN0IHBhcnNlZCA9IHt9O1xuICBsZXQga2V5O1xuICBsZXQgdmFsO1xuICBsZXQgaTtcblxuICByYXdIZWFkZXJzICYmIHJhd0hlYWRlcnMuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgaSkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gbGluZS5zdWJzdHJpbmcoaSArIDEpLnRyaW0oKTtcblxuICAgIGlmICgha2V5IHx8IChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZltrZXldKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgaWYgKHBhcnNlZFtrZXldKSB7XG4gICAgICAgIHBhcnNlZFtrZXldLnB1c2godmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gW3ZhbF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgcGFyc2VIZWFkZXJzIGZyb20gJy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzJztcblxuY29uc3QgJGludGVybmFscyA9IFN5bWJvbCgnaW50ZXJuYWxzJyk7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlciAmJiBTdHJpbmcoaGVhZGVyKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHV0aWxzLmlzQXJyYXkodmFsdWUpID8gdmFsdWUubWFwKG5vcm1hbGl6ZVZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVG9rZW5zKHN0cikge1xuICBjb25zdCB0b2tlbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBjb25zdCB0b2tlbnNSRSA9IC8oW15cXHMsOz1dKylcXHMqKD86PVxccyooW14sO10rKSk/L2c7XG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdG9rZW5zUkUuZXhlYyhzdHIpKSkge1xuICAgIHRva2Vuc1ttYXRjaFsxXV0gPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG5cbmNvbnN0IGlzVmFsaWRIZWFkZXJOYW1lID0gKHN0cikgPT4gL15bLV9hLXpBLVowLTleYHx+LCEjJCUmJyorLl0rJC8udGVzdChzdHIudHJpbSgpKTtcblxuZnVuY3Rpb24gbWF0Y2hIZWFkZXJWYWx1ZShjb250ZXh0LCB2YWx1ZSwgaGVhZGVyLCBmaWx0ZXIsIGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICBpZiAodXRpbHMuaXNGdW5jdGlvbihmaWx0ZXIpKSB7XG4gICAgcmV0dXJuIGZpbHRlci5jYWxsKHRoaXMsIHZhbHVlLCBoZWFkZXIpO1xuICB9XG5cbiAgaWYgKGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICAgIHZhbHVlID0gaGVhZGVyO1xuICB9XG5cbiAgaWYgKCF1dGlscy5pc1N0cmluZyh2YWx1ZSkpIHJldHVybjtcblxuICBpZiAodXRpbHMuaXNTdHJpbmcoZmlsdGVyKSkge1xuICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKGZpbHRlcikgIT09IC0xO1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzUmVnRXhwKGZpbHRlcikpIHtcbiAgICByZXR1cm4gZmlsdGVyLnRlc3QodmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlci50cmltKClcbiAgICAudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8oW2EtelxcZF0pKFxcdyopL2csICh3LCBjaGFyLCBzdHIpID0+IHtcbiAgICAgIHJldHVybiBjaGFyLnRvVXBwZXJDYXNlKCkgKyBzdHI7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQWNjZXNzb3JzKG9iaiwgaGVhZGVyKSB7XG4gIGNvbnN0IGFjY2Vzc29yTmFtZSA9IHV0aWxzLnRvQ2FtZWxDYXNlKCcgJyArIGhlYWRlcik7XG5cbiAgWydnZXQnLCAnc2V0JywgJ2hhcyddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbWV0aG9kTmFtZSArIGFjY2Vzc29yTmFtZSwge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kTmFtZV0uY2FsbCh0aGlzLCBoZWFkZXIsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICAgICAgfSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbn1cblxuY2xhc3MgQXhpb3NIZWFkZXJzIHtcbiAgY29uc3RydWN0b3IoaGVhZGVycykge1xuICAgIGhlYWRlcnMgJiYgdGhpcy5zZXQoaGVhZGVycyk7XG4gIH1cblxuICBzZXQoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSwgcmV3cml0ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2V0SGVhZGVyKF92YWx1ZSwgX2hlYWRlciwgX3Jld3JpdGUpIHtcbiAgICAgIGNvbnN0IGxIZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoX2hlYWRlcik7XG5cbiAgICAgIGlmICghbEhlYWRlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2hlYWRlciBuYW1lIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkoc2VsZiwgbEhlYWRlcik7XG5cbiAgICAgIGlmKCFrZXkgfHwgc2VsZltrZXldID09PSB1bmRlZmluZWQgfHwgX3Jld3JpdGUgPT09IHRydWUgfHwgKF9yZXdyaXRlID09PSB1bmRlZmluZWQgJiYgc2VsZltrZXldICE9PSBmYWxzZSkpIHtcbiAgICAgICAgc2VsZltrZXkgfHwgX2hlYWRlcl0gPSBub3JtYWxpemVWYWx1ZShfdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNldEhlYWRlcnMgPSAoaGVhZGVycywgX3Jld3JpdGUpID0+XG4gICAgICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIChfdmFsdWUsIF9oZWFkZXIpID0+IHNldEhlYWRlcihfdmFsdWUsIF9oZWFkZXIsIF9yZXdyaXRlKSk7XG5cbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChoZWFkZXIpIHx8IGhlYWRlciBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IpIHtcbiAgICAgIHNldEhlYWRlcnMoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSlcbiAgICB9IGVsc2UgaWYodXRpbHMuaXNTdHJpbmcoaGVhZGVyKSAmJiAoaGVhZGVyID0gaGVhZGVyLnRyaW0oKSkgJiYgIWlzVmFsaWRIZWFkZXJOYW1lKGhlYWRlcikpIHtcbiAgICAgIHNldEhlYWRlcnMocGFyc2VIZWFkZXJzKGhlYWRlciksIHZhbHVlT3JSZXdyaXRlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzSGVhZGVycyhoZWFkZXIpKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBoZWFkZXIuZW50cmllcygpKSB7XG4gICAgICAgIHNldEhlYWRlcih2YWx1ZSwga2V5LCByZXdyaXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVyICE9IG51bGwgJiYgc2V0SGVhZGVyKHZhbHVlT3JSZXdyaXRlLCBoZWFkZXIsIHJld3JpdGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0KGhlYWRlciwgcGFyc2VyKSB7XG4gICAgaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKGhlYWRlcik7XG5cbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHRoaXMsIGhlYWRlcik7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW2tleV07XG5cbiAgICAgICAgaWYgKCFwYXJzZXIpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyc2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5zKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcnNlcikpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VyLmNhbGwodGhpcywgdmFsdWUsIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNSZWdFeHAocGFyc2VyKSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZXIuZXhlYyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwYXJzZXIgbXVzdCBiZSBib29sZWFufHJlZ2V4cHxmdW5jdGlvbicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhcyhoZWFkZXIsIG1hdGNoZXIpIHtcbiAgICBoZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoaGVhZGVyKTtcblxuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkodGhpcywgaGVhZGVyKTtcblxuICAgICAgcmV0dXJuICEhKGtleSAmJiB0aGlzW2tleV0gIT09IHVuZGVmaW5lZCAmJiAoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlcikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBkZWxldGUoaGVhZGVyLCBtYXRjaGVyKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IGRlbGV0ZWQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUhlYWRlcihfaGVhZGVyKSB7XG4gICAgICBfaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoX2hlYWRlcikge1xuICAgICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHNlbGYsIF9oZWFkZXIpO1xuXG4gICAgICAgIGlmIChrZXkgJiYgKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUoc2VsZiwgc2VsZltrZXldLCBrZXksIG1hdGNoZXIpKSkge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmW2tleV07XG5cbiAgICAgICAgICBkZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5KGhlYWRlcikpIHtcbiAgICAgIGhlYWRlci5mb3JFYWNoKGRlbGV0ZUhlYWRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZUhlYWRlcihoZWFkZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBkZWxldGVkO1xuICB9XG5cbiAgY2xlYXIobWF0Y2hlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICAgIGxldCBkZWxldGVkID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlciwgdHJ1ZSkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgZGVsZXRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbGV0ZWQ7XG4gIH1cblxuICBub3JtYWxpemUoZm9ybWF0KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgaGVhZGVycyA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLCAodmFsdWUsIGhlYWRlcikgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleShoZWFkZXJzLCBoZWFkZXIpO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHNlbGZba2V5XSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub3JtYWxpemVkID0gZm9ybWF0ID8gZm9ybWF0SGVhZGVyKGhlYWRlcikgOiBTdHJpbmcoaGVhZGVyKS50cmltKCk7XG5cbiAgICAgIGlmIChub3JtYWxpemVkICE9PSBoZWFkZXIpIHtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgIH1cblxuICAgICAgc2VsZltub3JtYWxpemVkXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcblxuICAgICAgaGVhZGVyc1tub3JtYWxpemVkXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNvbmNhdCguLi50YXJnZXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY29uY2F0KHRoaXMsIC4uLnRhcmdldHMpO1xuICB9XG5cbiAgdG9KU09OKGFzU3RyaW5ncykge1xuICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICB1dGlscy5mb3JFYWNoKHRoaXMsICh2YWx1ZSwgaGVhZGVyKSA9PiB7XG4gICAgICB2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSAmJiAob2JqW2hlYWRlcl0gPSBhc1N0cmluZ3MgJiYgdXRpbHMuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5qb2luKCcsICcpIDogdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLnRvSlNPTigpKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy50b0pTT04oKSkubWFwKChbaGVhZGVyLCB2YWx1ZV0pID0+IGhlYWRlciArICc6ICcgKyB2YWx1ZSkuam9pbignXFxuJyk7XG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgcmV0dXJuICdBeGlvc0hlYWRlcnMnO1xuICB9XG5cbiAgc3RhdGljIGZyb20odGhpbmcpIHtcbiAgICByZXR1cm4gdGhpbmcgaW5zdGFuY2VvZiB0aGlzID8gdGhpbmcgOiBuZXcgdGhpcyh0aGluZyk7XG4gIH1cblxuICBzdGF0aWMgY29uY2F0KGZpcnN0LCAuLi50YXJnZXRzKSB7XG4gICAgY29uc3QgY29tcHV0ZWQgPSBuZXcgdGhpcyhmaXJzdCk7XG5cbiAgICB0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4gY29tcHV0ZWQuc2V0KHRhcmdldCkpO1xuXG4gICAgcmV0dXJuIGNvbXB1dGVkO1xuICB9XG5cbiAgc3RhdGljIGFjY2Vzc29yKGhlYWRlcikge1xuICAgIGNvbnN0IGludGVybmFscyA9IHRoaXNbJGludGVybmFsc10gPSAodGhpc1skaW50ZXJuYWxzXSA9IHtcbiAgICAgIGFjY2Vzc29yczoge31cbiAgICB9KTtcblxuICAgIGNvbnN0IGFjY2Vzc29ycyA9IGludGVybmFscy5hY2Nlc3NvcnM7XG4gICAgY29uc3QgcHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVBY2Nlc3NvcihfaGVhZGVyKSB7XG4gICAgICBjb25zdCBsSGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoIWFjY2Vzc29yc1tsSGVhZGVyXSkge1xuICAgICAgICBidWlsZEFjY2Vzc29ycyhwcm90b3R5cGUsIF9oZWFkZXIpO1xuICAgICAgICBhY2Nlc3NvcnNbbEhlYWRlcl0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzLmlzQXJyYXkoaGVhZGVyKSA/IGhlYWRlci5mb3JFYWNoKGRlZmluZUFjY2Vzc29yKSA6IGRlZmluZUFjY2Vzc29yKGhlYWRlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5BeGlvc0hlYWRlcnMuYWNjZXNzb3IoWydDb250ZW50LVR5cGUnLCAnQ29udGVudC1MZW5ndGgnLCAnQWNjZXB0JywgJ0FjY2VwdC1FbmNvZGluZycsICdVc2VyLUFnZW50JywgJ0F1dGhvcml6YXRpb24nXSk7XG5cbi8vIHJlc2VydmVkIG5hbWVzIGhvdGZpeFxudXRpbHMucmVkdWNlRGVzY3JpcHRvcnMoQXhpb3NIZWFkZXJzLnByb3RvdHlwZSwgKHt2YWx1ZX0sIGtleSkgPT4ge1xuICBsZXQgbWFwcGVkID0ga2V5WzBdLnRvVXBwZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSk7IC8vIG1hcCBgc2V0YCA9PiBgU2V0YFxuICByZXR1cm4ge1xuICAgIGdldDogKCkgPT4gdmFsdWUsXG4gICAgc2V0KGhlYWRlclZhbHVlKSB7XG4gICAgICB0aGlzW21hcHBlZF0gPSBoZWFkZXJWYWx1ZTtcbiAgICB9XG4gIH1cbn0pO1xuXG51dGlscy5mcmVlemVNZXRob2RzKEF4aW9zSGVhZGVycyk7XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zSGVhZGVycztcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHBhcmFtIHs/T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGZucywgcmVzcG9uc2UpIHtcbiAgY29uc3QgY29uZmlnID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgY29uc3QgY29udGV4dCA9IHJlc3BvbnNlIHx8IGNvbmZpZztcbiAgY29uc3QgaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGNvbnRleHQuaGVhZGVycyk7XG4gIGxldCBkYXRhID0gY29udGV4dC5kYXRhO1xuXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4uY2FsbChjb25maWcsIGRhdGEsIGhlYWRlcnMubm9ybWFsaXplKCksIHJlc3BvbnNlID8gcmVzcG9uc2Uuc3RhdHVzIDogdW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgaGVhZGVycy5ub3JtYWxpemUoKTtcblxuICByZXR1cm4gZGF0YTtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIEEgYENhbmNlbGVkRXJyb3JgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdD19IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3Q9fSByZXF1ZXN0IFRoZSByZXF1ZXN0LlxuICpcbiAqIEByZXR1cm5zIHtDYW5jZWxlZEVycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsZWRFcnJvcihtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gIEF4aW9zRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlID09IG51bGwgPyAnY2FuY2VsZWQnIDogbWVzc2FnZSwgQXhpb3NFcnJvci5FUlJfQ0FOQ0VMRUQsIGNvbmZpZywgcmVxdWVzdCk7XG4gIHRoaXMubmFtZSA9ICdDYW5jZWxlZEVycm9yJztcbn1cblxudXRpbHMuaW5oZXJpdHMoQ2FuY2VsZWRFcnJvciwgQXhpb3NFcnJvciwge1xuICBfX0NBTkNFTF9fOiB0cnVlXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsZWRFcnJvcjtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4vQXhpb3NFcnJvci5qcyc7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybnMge29iamVjdH0gVGhlIHJlc3BvbnNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICBjb25zdCB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgW0F4aW9zRXJyb3IuRVJSX0JBRF9SRVFVRVNULCBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0VdW01hdGguZmxvb3IocmVzcG9uc2Uuc3RhdHVzIC8gMTAwKSAtIDRdLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlUHJvdG9jb2wodXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gL14oWy0rXFx3XXsxLDI1fSkoOj9cXC9cXC98OikvLmV4ZWModXJsKTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdIHx8ICcnO1xufVxuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYWxjdWxhdGUgZGF0YSBtYXhSYXRlXG4gKiBAcGFyYW0ge051bWJlcn0gW3NhbXBsZXNDb3VudD0gMTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW21pbj0gMTAwMF1cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gc3BlZWRvbWV0ZXIoc2FtcGxlc0NvdW50LCBtaW4pIHtcbiAgc2FtcGxlc0NvdW50ID0gc2FtcGxlc0NvdW50IHx8IDEwO1xuICBjb25zdCBieXRlcyA9IG5ldyBBcnJheShzYW1wbGVzQ291bnQpO1xuICBjb25zdCB0aW1lc3RhbXBzID0gbmV3IEFycmF5KHNhbXBsZXNDb3VudCk7XG4gIGxldCBoZWFkID0gMDtcbiAgbGV0IHRhaWwgPSAwO1xuICBsZXQgZmlyc3RTYW1wbGVUUztcblxuICBtaW4gPSBtaW4gIT09IHVuZGVmaW5lZCA/IG1pbiA6IDEwMDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHB1c2goY2h1bmtMZW5ndGgpIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgY29uc3Qgc3RhcnRlZEF0ID0gdGltZXN0YW1wc1t0YWlsXTtcblxuICAgIGlmICghZmlyc3RTYW1wbGVUUykge1xuICAgICAgZmlyc3RTYW1wbGVUUyA9IG5vdztcbiAgICB9XG5cbiAgICBieXRlc1toZWFkXSA9IGNodW5rTGVuZ3RoO1xuICAgIHRpbWVzdGFtcHNbaGVhZF0gPSBub3c7XG5cbiAgICBsZXQgaSA9IHRhaWw7XG4gICAgbGV0IGJ5dGVzQ291bnQgPSAwO1xuXG4gICAgd2hpbGUgKGkgIT09IGhlYWQpIHtcbiAgICAgIGJ5dGVzQ291bnQgKz0gYnl0ZXNbaSsrXTtcbiAgICAgIGkgPSBpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGhlYWQgPSAoaGVhZCArIDEpICUgc2FtcGxlc0NvdW50O1xuXG4gICAgaWYgKGhlYWQgPT09IHRhaWwpIHtcbiAgICAgIHRhaWwgPSAodGFpbCArIDEpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGlmIChub3cgLSBmaXJzdFNhbXBsZVRTIDwgbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFzc2VkID0gc3RhcnRlZEF0ICYmIG5vdyAtIHN0YXJ0ZWRBdDtcblxuICAgIHJldHVybiBwYXNzZWQgPyBNYXRoLnJvdW5kKGJ5dGVzQ291bnQgKiAxMDAwIC8gcGFzc2VkKSA6IHVuZGVmaW5lZDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3BlZWRvbWV0ZXI7XG4iLCAiLyoqXG4gKiBUaHJvdHRsZSBkZWNvcmF0b3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge051bWJlcn0gZnJlcVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZuLCBmcmVxKSB7XG4gIGxldCB0aW1lc3RhbXAgPSAwO1xuICBsZXQgdGhyZXNob2xkID0gMTAwMCAvIGZyZXE7XG4gIGxldCBsYXN0QXJncztcbiAgbGV0IHRpbWVyO1xuXG4gIGNvbnN0IGludm9rZSA9IChhcmdzLCBub3cgPSBEYXRlLm5vdygpKSA9PiB7XG4gICAgdGltZXN0YW1wID0gbm93O1xuICAgIGxhc3RBcmdzID0gbnVsbDtcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9XG5cbiAgY29uc3QgdGhyb3R0bGVkID0gKC4uLmFyZ3MpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHBhc3NlZCA9IG5vdyAtIHRpbWVzdGFtcDtcbiAgICBpZiAoIHBhc3NlZCA+PSB0aHJlc2hvbGQpIHtcbiAgICAgIGludm9rZShhcmdzLCBub3cpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0QXJncyA9IGFyZ3M7XG4gICAgICBpZiAoIXRpbWVyKSB7XG4gICAgICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICAgIGludm9rZShsYXN0QXJncylcbiAgICAgICAgfSwgdGhyZXNob2xkIC0gcGFzc2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBmbHVzaCA9ICgpID0+IGxhc3RBcmdzICYmIGludm9rZShsYXN0QXJncyk7XG5cbiAgcmV0dXJuIFt0aHJvdHRsZWQsIGZsdXNoXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdGhyb3R0bGU7XG4iLCAiaW1wb3J0IHNwZWVkb21ldGVyIGZyb20gXCIuL3NwZWVkb21ldGVyLmpzXCI7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSBcIi4vdGhyb3R0bGUuanNcIjtcbmltcG9ydCB1dGlscyBmcm9tIFwiLi4vdXRpbHMuanNcIjtcblxuZXhwb3J0IGNvbnN0IHByb2dyZXNzRXZlbnRSZWR1Y2VyID0gKGxpc3RlbmVyLCBpc0Rvd25sb2FkU3RyZWFtLCBmcmVxID0gMykgPT4ge1xuICBsZXQgYnl0ZXNOb3RpZmllZCA9IDA7XG4gIGNvbnN0IF9zcGVlZG9tZXRlciA9IHNwZWVkb21ldGVyKDUwLCAyNTApO1xuXG4gIHJldHVybiB0aHJvdHRsZShlID0+IHtcbiAgICBjb25zdCBsb2FkZWQgPSBlLmxvYWRlZDtcbiAgICBjb25zdCB0b3RhbCA9IGUubGVuZ3RoQ29tcHV0YWJsZSA/IGUudG90YWwgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcHJvZ3Jlc3NCeXRlcyA9IGxvYWRlZCAtIGJ5dGVzTm90aWZpZWQ7XG4gICAgY29uc3QgcmF0ZSA9IF9zcGVlZG9tZXRlcihwcm9ncmVzc0J5dGVzKTtcbiAgICBjb25zdCBpblJhbmdlID0gbG9hZGVkIDw9IHRvdGFsO1xuXG4gICAgYnl0ZXNOb3RpZmllZCA9IGxvYWRlZDtcblxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBsb2FkZWQsXG4gICAgICB0b3RhbCxcbiAgICAgIHByb2dyZXNzOiB0b3RhbCA/IChsb2FkZWQgLyB0b3RhbCkgOiB1bmRlZmluZWQsXG4gICAgICBieXRlczogcHJvZ3Jlc3NCeXRlcyxcbiAgICAgIHJhdGU6IHJhdGUgPyByYXRlIDogdW5kZWZpbmVkLFxuICAgICAgZXN0aW1hdGVkOiByYXRlICYmIHRvdGFsICYmIGluUmFuZ2UgPyAodG90YWwgLSBsb2FkZWQpIC8gcmF0ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGV2ZW50OiBlLFxuICAgICAgbGVuZ3RoQ29tcHV0YWJsZTogdG90YWwgIT0gbnVsbCxcbiAgICAgIFtpc0Rvd25sb2FkU3RyZWFtID8gJ2Rvd25sb2FkJyA6ICd1cGxvYWQnXTogdHJ1ZVxuICAgIH07XG5cbiAgICBsaXN0ZW5lcihkYXRhKTtcbiAgfSwgZnJlcSk7XG59XG5cbmV4cG9ydCBjb25zdCBwcm9ncmVzc0V2ZW50RGVjb3JhdG9yID0gKHRvdGFsLCB0aHJvdHRsZWQpID0+IHtcbiAgY29uc3QgbGVuZ3RoQ29tcHV0YWJsZSA9IHRvdGFsICE9IG51bGw7XG5cbiAgcmV0dXJuIFsobG9hZGVkKSA9PiB0aHJvdHRsZWRbMF0oe1xuICAgIGxlbmd0aENvbXB1dGFibGUsXG4gICAgdG90YWwsXG4gICAgbG9hZGVkXG4gIH0pLCB0aHJvdHRsZWRbMV1dO1xufVxuXG5leHBvcnQgY29uc3QgYXN5bmNEZWNvcmF0b3IgPSAoZm4pID0+ICguLi5hcmdzKSA9PiB1dGlscy5hc2FwKCgpID0+IGZuKC4uLmFyZ3MpKTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudiA/XG5cbi8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgY29uc3QgbXNpZSA9IHBsYXRmb3JtLm5hdmlnYXRvciAmJiAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KHBsYXRmb3JtLm5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIGNvbnN0IHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxldCBvcmlnaW5VUkw7XG5cbiAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0cyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICBsZXQgaHJlZiA9IHVybDtcblxuICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICB9XG5cbiAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICByZXR1cm4ge1xuICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgY29uc3QgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfSkoKTtcbiIsICJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuXG5leHBvcnQgZGVmYXVsdCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICB7XG4gICAgd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICBjb25zdCBjb29raWUgPSBbbmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSldO1xuXG4gICAgICB1dGlscy5pc051bWJlcihleHBpcmVzKSAmJiBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG5cbiAgICAgIHV0aWxzLmlzU3RyaW5nKHBhdGgpICYmIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcblxuICAgICAgdXRpbHMuaXNTdHJpbmcoZG9tYWluKSAmJiBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuXG4gICAgICBzZWN1cmUgPT09IHRydWUgJiYgY29va2llLnB1c2goJ3NlY3VyZScpO1xuXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICB9LFxuXG4gICAgcmVhZChuYW1lKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgIH0sXG5cbiAgICByZW1vdmUobmFtZSkge1xuICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICB9XG4gIH1cblxuICA6XG5cbiAgLy8gTm9uLXN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICB7XG4gICAgd3JpdGUoKSB7fSxcbiAgICByZWFkKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByZW1vdmUoKSB7fVxuICB9O1xuXG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZCtcXC0uXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvP1xcLyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBpc0Fic29sdXRlVVJMIGZyb20gJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyc7XG5pbXBvcnQgY29tYmluZVVSTHMgZnJvbSAnLi4vaGVscGVycy9jb21iaW5lVVJMcy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL0F4aW9zSGVhZGVycy5qc1wiO1xuXG5jb25zdCBoZWFkZXJzVG9PYmplY3QgPSAodGhpbmcpID0+IHRoaW5nIGluc3RhbmNlb2YgQXhpb3NIZWFkZXJzID8geyAuLi50aGluZyB9IDogdGhpbmc7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIGNvbnN0IGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlLCBjYXNlbGVzcykge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UuY2FsbCh7Y2FzZWxlc3N9LCB0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMoYSwgYiwgY2FzZWxlc3MpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoYSwgYiwgY2FzZWxlc3MpO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGEpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhLCBjYXNlbGVzcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIoYSwgYikge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYikpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKGEsIGIpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBiKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChhKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhhLCBiLCBwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGEsIGIpO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtZXJnZU1hcCA9IHtcbiAgICB1cmw6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgbWV0aG9kOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIGRhdGE6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgYmFzZVVSTDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHBhcmFtc1NlcmlhbGl6ZXI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdGltZW91dDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0aW1lb3V0TWVzc2FnZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB3aXRoQ3JlZGVudGlhbHM6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgd2l0aFhTUkZUb2tlbjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBhZGFwdGVyOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHJlc3BvbnNlVHlwZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmQ29va2llTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB4c3JmSGVhZGVyTmFtZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBvblVwbG9hZFByb2dyZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG9uRG93bmxvYWRQcm9ncmVzczogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBkZWNvbXByZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG1heENvbnRlbnRMZW5ndGg6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgbWF4Qm9keUxlbmd0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBiZWZvcmVSZWRpcmVjdDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc3BvcnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgaHR0cEFnZW50OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGh0dHBzQWdlbnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgY2FuY2VsVG9rZW46IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgc29ja2V0UGF0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICByZXNwb25zZUVuY29kaW5nOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHZhbGlkYXRlU3RhdHVzOiBtZXJnZURpcmVjdEtleXMsXG4gICAgaGVhZGVyczogKGEsIGIpID0+IG1lcmdlRGVlcFByb3BlcnRpZXMoaGVhZGVyc1RvT2JqZWN0KGEpLCBoZWFkZXJzVG9PYmplY3QoYiksIHRydWUpXG4gIH07XG5cbiAgdXRpbHMuZm9yRWFjaChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCBjb25maWcxLCBjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgY29uc3QgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gbWVyZ2UoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSwgcHJvcCk7XG4gICAgKHV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZ1ZhbHVlKSAmJiBtZXJnZSAhPT0gbWVyZ2VEaXJlY3RLZXlzKSB8fCAoY29uZmlnW3Byb3BdID0gY29uZmlnVmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufVxuIiwgImltcG9ydCBwbGF0Zm9ybSBmcm9tIFwiLi4vcGxhdGZvcm0vaW5kZXguanNcIjtcbmltcG9ydCB1dGlscyBmcm9tIFwiLi4vdXRpbHMuanNcIjtcbmltcG9ydCBpc1VSTFNhbWVPcmlnaW4gZnJvbSBcIi4vaXNVUkxTYW1lT3JpZ2luLmpzXCI7XG5pbXBvcnQgY29va2llcyBmcm9tIFwiLi9jb29raWVzLmpzXCI7XG5pbXBvcnQgYnVpbGRGdWxsUGF0aCBmcm9tIFwiLi4vY29yZS9idWlsZEZ1bGxQYXRoLmpzXCI7XG5pbXBvcnQgbWVyZ2VDb25maWcgZnJvbSBcIi4uL2NvcmUvbWVyZ2VDb25maWcuanNcIjtcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSBcIi4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzXCI7XG5pbXBvcnQgYnVpbGRVUkwgZnJvbSBcIi4vYnVpbGRVUkwuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgKGNvbmZpZykgPT4ge1xuICBjb25zdCBuZXdDb25maWcgPSBtZXJnZUNvbmZpZyh7fSwgY29uZmlnKTtcblxuICBsZXQge2RhdGEsIHdpdGhYU1JGVG9rZW4sIHhzcmZIZWFkZXJOYW1lLCB4c3JmQ29va2llTmFtZSwgaGVhZGVycywgYXV0aH0gPSBuZXdDb25maWc7XG5cbiAgbmV3Q29uZmlnLmhlYWRlcnMgPSBoZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oaGVhZGVycyk7XG5cbiAgbmV3Q29uZmlnLnVybCA9IGJ1aWxkVVJMKGJ1aWxkRnVsbFBhdGgobmV3Q29uZmlnLmJhc2VVUkwsIG5ld0NvbmZpZy51cmwpLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG5cbiAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICBpZiAoYXV0aCkge1xuICAgIGhlYWRlcnMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgK1xuICAgICAgYnRvYSgoYXV0aC51c2VybmFtZSB8fCAnJykgKyAnOicgKyAoYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChhdXRoLnBhc3N3b3JkKSkgOiAnJykpXG4gICAgKTtcbiAgfVxuXG4gIGxldCBjb250ZW50VHlwZTtcblxuICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSkge1xuICAgIGlmIChwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYgfHwgcGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52KSB7XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKHVuZGVmaW5lZCk7IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9IGVsc2UgaWYgKChjb250ZW50VHlwZSA9IGhlYWRlcnMuZ2V0Q29udGVudFR5cGUoKSkgIT09IGZhbHNlKSB7XG4gICAgICAvLyBmaXggc2VtaWNvbG9uIGR1cGxpY2F0aW9uIGlzc3VlIGZvciBSZWFjdE5hdGl2ZSBGb3JtRGF0YSBpbXBsZW1lbnRhdGlvblxuICAgICAgY29uc3QgW3R5cGUsIC4uLnRva2Vuc10gPSBjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JykubWFwKHRva2VuID0+IHRva2VuLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pIDogW107XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKFt0eXBlIHx8ICdtdWx0aXBhcnQvZm9ybS1kYXRhJywgLi4udG9rZW5zXS5qb2luKCc7ICcpKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG5cbiAgaWYgKHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudikge1xuICAgIHdpdGhYU1JGVG9rZW4gJiYgdXRpbHMuaXNGdW5jdGlvbih3aXRoWFNSRlRva2VuKSAmJiAod2l0aFhTUkZUb2tlbiA9IHdpdGhYU1JGVG9rZW4obmV3Q29uZmlnKSk7XG5cbiAgICBpZiAod2l0aFhTUkZUb2tlbiB8fCAod2l0aFhTUkZUb2tlbiAhPT0gZmFsc2UgJiYgaXNVUkxTYW1lT3JpZ2luKG5ld0NvbmZpZy51cmwpKSkge1xuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICBjb25zdCB4c3JmVmFsdWUgPSB4c3JmSGVhZGVyTmFtZSAmJiB4c3JmQ29va2llTmFtZSAmJiBjb29raWVzLnJlYWQoeHNyZkNvb2tpZU5hbWUpO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIGhlYWRlcnMuc2V0KHhzcmZIZWFkZXJOYW1lLCB4c3JmVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdDb25maWc7XG59XG5cbiIsICJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgc2V0dGxlIGZyb20gJy4vLi4vY29yZS9zZXR0bGUuanMnO1xuaW1wb3J0IHRyYW5zaXRpb25hbERlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IHBhcnNlUHJvdG9jb2wgZnJvbSAnLi4vaGVscGVycy9wYXJzZVByb3RvY29sLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCB7cHJvZ3Jlc3NFdmVudFJlZHVjZXJ9IGZyb20gJy4uL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMnO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuXG5jb25zdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgPSB0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgJiYgZnVuY3Rpb24gKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IF9jb25maWcgPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG4gICAgbGV0IHJlcXVlc3REYXRhID0gX2NvbmZpZy5kYXRhO1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oX2NvbmZpZy5oZWFkZXJzKS5ub3JtYWxpemUoKTtcbiAgICBsZXQge3Jlc3BvbnNlVHlwZSwgb25VcGxvYWRQcm9ncmVzcywgb25Eb3dubG9hZFByb2dyZXNzfSA9IF9jb25maWc7XG4gICAgbGV0IG9uQ2FuY2VsZWQ7XG4gICAgbGV0IHVwbG9hZFRocm90dGxlZCwgZG93bmxvYWRUaHJvdHRsZWQ7XG4gICAgbGV0IGZsdXNoVXBsb2FkLCBmbHVzaERvd25sb2FkO1xuXG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGZsdXNoVXBsb2FkICYmIGZsdXNoVXBsb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuICAgICAgZmx1c2hEb3dubG9hZCAmJiBmbHVzaERvd25sb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuXG4gICAgICBfY29uZmlnLmNhbmNlbFRva2VuICYmIF9jb25maWcuY2FuY2VsVG9rZW4udW5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG5cbiAgICAgIF9jb25maWcuc2lnbmFsICYmIF9jb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgfVxuXG4gICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHJlcXVlc3Qub3BlbihfY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBfY29uZmlnLnVybCwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IF9jb25maWcudGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oXG4gICAgICAgICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgJiYgcmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSAndGV4dCcgfHwgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUoZnVuY3Rpb24gX3Jlc29sdmUodmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIF9yZWplY3QoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgbGV0IHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBfY29uZmlnLnRpbWVvdXQgPyAndGltZW91dCBvZiAnICsgX2NvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgIGNvbnN0IHRyYW5zaXRpb25hbCA9IF9jb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgaWYgKF9jb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gX2NvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlLFxuICAgICAgICB0cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/IEF4aW9zRXJyb3IuRVRJTUVET1VUIDogQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgIHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQgJiYgcmVxdWVzdEhlYWRlcnMuc2V0Q29udGVudFR5cGUobnVsbCk7XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycy50b0pTT04oKSwgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoX2NvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhX2NvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChyZXNwb25zZVR5cGUgJiYgcmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gX2NvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmIChvbkRvd25sb2FkUHJvZ3Jlc3MpIHtcbiAgICAgIChbZG93bmxvYWRUaHJvdHRsZWQsIGZsdXNoRG93bmxvYWRdID0gcHJvZ3Jlc3NFdmVudFJlZHVjZXIob25Eb3dubG9hZFByb2dyZXNzLCB0cnVlKSk7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZG93bmxvYWRUaHJvdHRsZWQpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKG9uVXBsb2FkUHJvZ3Jlc3MgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIChbdXBsb2FkVGhyb3R0bGVkLCBmbHVzaFVwbG9hZF0gPSBwcm9ncmVzc0V2ZW50UmVkdWNlcihvblVwbG9hZFByb2dyZXNzKSk7XG5cbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgdXBsb2FkVGhyb3R0bGVkKTtcblxuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIGZsdXNoVXBsb2FkKTtcbiAgICB9XG5cbiAgICBpZiAoX2NvbmZpZy5jYW5jZWxUb2tlbiB8fCBfY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBjYW5jZWwgPT4ge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgY2FuY2VsLnR5cGUgPyBuZXcgQ2FuY2VsZWRFcnJvcihudWxsLCBjb25maWcsIHJlcXVlc3QpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIF9jb25maWcuY2FuY2VsVG9rZW4gJiYgX2NvbmZpZy5jYW5jZWxUb2tlbi5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICBpZiAoX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgX2NvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IF9jb25maWcuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwYXJzZVByb3RvY29sKF9jb25maWcudXJsKTtcblxuICAgIGlmIChwcm90b2NvbCAmJiBwbGF0Zm9ybS5wcm90b2NvbHMuaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1Vuc3VwcG9ydGVkIHByb3RvY29sICcgKyBwcm90b2NvbCArICc6JywgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCAiaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSBcIi4uL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzXCI7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG5jb25zdCBjb21wb3NlU2lnbmFscyA9IChzaWduYWxzLCB0aW1lb3V0KSA9PiB7XG4gIGNvbnN0IHtsZW5ndGh9ID0gKHNpZ25hbHMgPSBzaWduYWxzID8gc2lnbmFscy5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG5cbiAgaWYgKHRpbWVvdXQgfHwgbGVuZ3RoKSB7XG4gICAgbGV0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICBsZXQgYWJvcnRlZDtcblxuICAgIGNvbnN0IG9uYWJvcnQgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoIWFib3J0ZWQpIHtcbiAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIGNvbnN0IGVyciA9IHJlYXNvbiBpbnN0YW5jZW9mIEVycm9yID8gcmVhc29uIDogdGhpcy5yZWFzb247XG4gICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoZXJyIGluc3RhbmNlb2YgQXhpb3NFcnJvciA/IGVyciA6IG5ldyBDYW5jZWxlZEVycm9yKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBlcnIpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdGltZXIgPSB0aW1lb3V0ICYmIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgb25hYm9ydChuZXcgQXhpb3NFcnJvcihgdGltZW91dCAke3RpbWVvdXR9IG9mIG1zIGV4Y2VlZGVkYCwgQXhpb3NFcnJvci5FVElNRURPVVQpKVxuICAgIH0sIHRpbWVvdXQpXG5cbiAgICBjb25zdCB1bnN1YnNjcmliZSA9ICgpID0+IHtcbiAgICAgIGlmIChzaWduYWxzKSB7XG4gICAgICAgIHRpbWVyICYmIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgc2lnbmFscy5mb3JFYWNoKHNpZ25hbCA9PiB7XG4gICAgICAgICAgc2lnbmFsLnVuc3Vic2NyaWJlID8gc2lnbmFsLnVuc3Vic2NyaWJlKG9uYWJvcnQpIDogc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduYWxzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaWduYWxzLmZvckVhY2goKHNpZ25hbCkgPT4gc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCkpO1xuXG4gICAgY29uc3Qge3NpZ25hbH0gPSBjb250cm9sbGVyO1xuXG4gICAgc2lnbmFsLnVuc3Vic2NyaWJlID0gKCkgPT4gdXRpbHMuYXNhcCh1bnN1YnNjcmliZSk7XG5cbiAgICByZXR1cm4gc2lnbmFsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvc2VTaWduYWxzO1xuIiwgIlxuZXhwb3J0IGNvbnN0IHN0cmVhbUNodW5rID0gZnVuY3Rpb24qIChjaHVuaywgY2h1bmtTaXplKSB7XG4gIGxldCBsZW4gPSBjaHVuay5ieXRlTGVuZ3RoO1xuXG4gIGlmICghY2h1bmtTaXplIHx8IGxlbiA8IGNodW5rU2l6ZSkge1xuICAgIHlpZWxkIGNodW5rO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBwb3MgPSAwO1xuICBsZXQgZW5kO1xuXG4gIHdoaWxlIChwb3MgPCBsZW4pIHtcbiAgICBlbmQgPSBwb3MgKyBjaHVua1NpemU7XG4gICAgeWllbGQgY2h1bmsuc2xpY2UocG9zLCBlbmQpO1xuICAgIHBvcyA9IGVuZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmVhZEJ5dGVzID0gYXN5bmMgZnVuY3Rpb24qIChpdGVyYWJsZSwgY2h1bmtTaXplKSB7XG4gIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgcmVhZFN0cmVhbShpdGVyYWJsZSkpIHtcbiAgICB5aWVsZCogc3RyZWFtQ2h1bmsoY2h1bmssIGNodW5rU2l6ZSk7XG4gIH1cbn1cblxuY29uc3QgcmVhZFN0cmVhbSA9IGFzeW5jIGZ1bmN0aW9uKiAoc3RyZWFtKSB7XG4gIGlmIChzdHJlYW1bU3ltYm9sLmFzeW5jSXRlcmF0b3JdKSB7XG4gICAgeWllbGQqIHN0cmVhbTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uZ2V0UmVhZGVyKCk7XG4gIHRyeSB7XG4gICAgZm9yICg7Oykge1xuICAgICAgY29uc3Qge2RvbmUsIHZhbHVlfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHlpZWxkIHZhbHVlO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWFkZXIuY2FuY2VsKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHRyYWNrU3RyZWFtID0gKHN0cmVhbSwgY2h1bmtTaXplLCBvblByb2dyZXNzLCBvbkZpbmlzaCkgPT4ge1xuICBjb25zdCBpdGVyYXRvciA9IHJlYWRCeXRlcyhzdHJlYW0sIGNodW5rU2l6ZSk7XG5cbiAgbGV0IGJ5dGVzID0gMDtcbiAgbGV0IGRvbmU7XG4gIGxldCBfb25GaW5pc2ggPSAoZSkgPT4ge1xuICAgIGlmICghZG9uZSkge1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICBvbkZpbmlzaCAmJiBvbkZpbmlzaChlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFJlYWRhYmxlU3RyZWFtKHtcbiAgICBhc3luYyBwdWxsKGNvbnRyb2xsZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHtkb25lLCB2YWx1ZX0gPSBhd2FpdCBpdGVyYXRvci5uZXh0KCk7XG5cbiAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgIF9vbkZpbmlzaCgpO1xuICAgICAgICAgIGNvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGVuID0gdmFsdWUuYnl0ZUxlbmd0aDtcbiAgICAgICAgaWYgKG9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgICBsZXQgbG9hZGVkQnl0ZXMgPSBieXRlcyArPSBsZW47XG4gICAgICAgICAgb25Qcm9ncmVzcyhsb2FkZWRCeXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKG5ldyBVaW50OEFycmF5KHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX29uRmluaXNoKGVycik7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhbmNlbChyZWFzb24pIHtcbiAgICAgIF9vbkZpbmlzaChyZWFzb24pO1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLnJldHVybigpO1xuICAgIH1cbiAgfSwge1xuICAgIGhpZ2hXYXRlck1hcms6IDJcbiAgfSlcbn1cbiIsICJpbXBvcnQgcGxhdGZvcm0gZnJvbSBcIi4uL3BsYXRmb3JtL2luZGV4LmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5pbXBvcnQgY29tcG9zZVNpZ25hbHMgZnJvbSBcIi4uL2hlbHBlcnMvY29tcG9zZVNpZ25hbHMuanNcIjtcbmltcG9ydCB7dHJhY2tTdHJlYW19IGZyb20gXCIuLi9oZWxwZXJzL3RyYWNrU3RyZWFtLmpzXCI7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuLi9jb3JlL0F4aW9zSGVhZGVycy5qc1wiO1xuaW1wb3J0IHtwcm9ncmVzc0V2ZW50UmVkdWNlciwgcHJvZ3Jlc3NFdmVudERlY29yYXRvciwgYXN5bmNEZWNvcmF0b3J9IGZyb20gXCIuLi9oZWxwZXJzL3Byb2dyZXNzRXZlbnRSZWR1Y2VyLmpzXCI7XG5pbXBvcnQgcmVzb2x2ZUNvbmZpZyBmcm9tIFwiLi4vaGVscGVycy9yZXNvbHZlQ29uZmlnLmpzXCI7XG5pbXBvcnQgc2V0dGxlIGZyb20gXCIuLi9jb3JlL3NldHRsZS5qc1wiO1xuXG5jb25zdCBpc0ZldGNoU3VwcG9ydGVkID0gdHlwZW9mIGZldGNoID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBSZXF1ZXN0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBSZXNwb25zZSA9PT0gJ2Z1bmN0aW9uJztcbmNvbnN0IGlzUmVhZGFibGVTdHJlYW1TdXBwb3J0ZWQgPSBpc0ZldGNoU3VwcG9ydGVkICYmIHR5cGVvZiBSZWFkYWJsZVN0cmVhbSA9PT0gJ2Z1bmN0aW9uJztcblxuLy8gdXNlZCBvbmx5IGluc2lkZSB0aGUgZmV0Y2ggYWRhcHRlclxuY29uc3QgZW5jb2RlVGV4dCA9IGlzRmV0Y2hTdXBwb3J0ZWQgJiYgKHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgKChlbmNvZGVyKSA9PiAoc3RyKSA9PiBlbmNvZGVyLmVuY29kZShzdHIpKShuZXcgVGV4dEVuY29kZXIoKSkgOlxuICAgIGFzeW5jIChzdHIpID0+IG5ldyBVaW50OEFycmF5KGF3YWl0IG5ldyBSZXNwb25zZShzdHIpLmFycmF5QnVmZmVyKCkpXG4pO1xuXG5jb25zdCB0ZXN0ID0gKGZuLCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZm4oLi4uYXJncyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBzdXBwb3J0c1JlcXVlc3RTdHJlYW0gPSBpc1JlYWRhYmxlU3RyZWFtU3VwcG9ydGVkICYmIHRlc3QoKCkgPT4ge1xuICBsZXQgZHVwbGV4QWNjZXNzZWQgPSBmYWxzZTtcblxuICBjb25zdCBoYXNDb250ZW50VHlwZSA9IG5ldyBSZXF1ZXN0KHBsYXRmb3JtLm9yaWdpbiwge1xuICAgIGJvZHk6IG5ldyBSZWFkYWJsZVN0cmVhbSgpLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGdldCBkdXBsZXgoKSB7XG4gICAgICBkdXBsZXhBY2Nlc3NlZCA9IHRydWU7XG4gICAgICByZXR1cm4gJ2hhbGYnO1xuICAgIH0sXG4gIH0pLmhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKTtcblxuICByZXR1cm4gZHVwbGV4QWNjZXNzZWQgJiYgIWhhc0NvbnRlbnRUeXBlO1xufSk7XG5cbmNvbnN0IERFRkFVTFRfQ0hVTktfU0laRSA9IDY0ICogMTAyNDtcblxuY29uc3Qgc3VwcG9ydHNSZXNwb25zZVN0cmVhbSA9IGlzUmVhZGFibGVTdHJlYW1TdXBwb3J0ZWQgJiZcbiAgdGVzdCgoKSA9PiB1dGlscy5pc1JlYWRhYmxlU3RyZWFtKG5ldyBSZXNwb25zZSgnJykuYm9keSkpO1xuXG5cbmNvbnN0IHJlc29sdmVycyA9IHtcbiAgc3RyZWFtOiBzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmICgocmVzKSA9PiByZXMuYm9keSlcbn07XG5cbmlzRmV0Y2hTdXBwb3J0ZWQgJiYgKCgocmVzKSA9PiB7XG4gIFsndGV4dCcsICdhcnJheUJ1ZmZlcicsICdibG9iJywgJ2Zvcm1EYXRhJywgJ3N0cmVhbSddLmZvckVhY2godHlwZSA9PiB7XG4gICAgIXJlc29sdmVyc1t0eXBlXSAmJiAocmVzb2x2ZXJzW3R5cGVdID0gdXRpbHMuaXNGdW5jdGlvbihyZXNbdHlwZV0pID8gKHJlcykgPT4gcmVzW3R5cGVdKCkgOlxuICAgICAgKF8sIGNvbmZpZykgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihgUmVzcG9uc2UgdHlwZSAnJHt0eXBlfScgaXMgbm90IHN1cHBvcnRlZGAsIEF4aW9zRXJyb3IuRVJSX05PVF9TVVBQT1JULCBjb25maWcpO1xuICAgICAgfSlcbiAgfSk7XG59KShuZXcgUmVzcG9uc2UpKTtcblxuY29uc3QgZ2V0Qm9keUxlbmd0aCA9IGFzeW5jIChib2R5KSA9PiB7XG4gIGlmIChib2R5ID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmKHV0aWxzLmlzQmxvYihib2R5KSkge1xuICAgIHJldHVybiBib2R5LnNpemU7XG4gIH1cblxuICBpZih1dGlscy5pc1NwZWNDb21wbGlhbnRGb3JtKGJvZHkpKSB7XG4gICAgY29uc3QgX3JlcXVlc3QgPSBuZXcgUmVxdWVzdChwbGF0Zm9ybS5vcmlnaW4sIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keSxcbiAgICB9KTtcbiAgICByZXR1cm4gKGF3YWl0IF9yZXF1ZXN0LmFycmF5QnVmZmVyKCkpLmJ5dGVMZW5ndGg7XG4gIH1cblxuICBpZih1dGlscy5pc0FycmF5QnVmZmVyVmlldyhib2R5KSB8fCB1dGlscy5pc0FycmF5QnVmZmVyKGJvZHkpKSB7XG4gICAgcmV0dXJuIGJvZHkuYnl0ZUxlbmd0aDtcbiAgfVxuXG4gIGlmKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGJvZHkpKSB7XG4gICAgYm9keSA9IGJvZHkgKyAnJztcbiAgfVxuXG4gIGlmKHV0aWxzLmlzU3RyaW5nKGJvZHkpKSB7XG4gICAgcmV0dXJuIChhd2FpdCBlbmNvZGVUZXh0KGJvZHkpKS5ieXRlTGVuZ3RoO1xuICB9XG59XG5cbmNvbnN0IHJlc29sdmVCb2R5TGVuZ3RoID0gYXN5bmMgKGhlYWRlcnMsIGJvZHkpID0+IHtcbiAgY29uc3QgbGVuZ3RoID0gdXRpbHMudG9GaW5pdGVOdW1iZXIoaGVhZGVycy5nZXRDb250ZW50TGVuZ3RoKCkpO1xuXG4gIHJldHVybiBsZW5ndGggPT0gbnVsbCA/IGdldEJvZHlMZW5ndGgoYm9keSkgOiBsZW5ndGg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRmV0Y2hTdXBwb3J0ZWQgJiYgKGFzeW5jIChjb25maWcpID0+IHtcbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgbWV0aG9kLFxuICAgIGRhdGEsXG4gICAgc2lnbmFsLFxuICAgIGNhbmNlbFRva2VuLFxuICAgIHRpbWVvdXQsXG4gICAgb25Eb3dubG9hZFByb2dyZXNzLFxuICAgIG9uVXBsb2FkUHJvZ3Jlc3MsXG4gICAgcmVzcG9uc2VUeXBlLFxuICAgIGhlYWRlcnMsXG4gICAgd2l0aENyZWRlbnRpYWxzID0gJ3NhbWUtb3JpZ2luJyxcbiAgICBmZXRjaE9wdGlvbnNcbiAgfSA9IHJlc29sdmVDb25maWcoY29uZmlnKTtcblxuICByZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGUgPyAocmVzcG9uc2VUeXBlICsgJycpLnRvTG93ZXJDYXNlKCkgOiAndGV4dCc7XG5cbiAgbGV0IGNvbXBvc2VkU2lnbmFsID0gY29tcG9zZVNpZ25hbHMoW3NpZ25hbCwgY2FuY2VsVG9rZW4gJiYgY2FuY2VsVG9rZW4udG9BYm9ydFNpZ25hbCgpXSwgdGltZW91dCk7XG5cbiAgbGV0IHJlcXVlc3Q7XG5cbiAgY29uc3QgdW5zdWJzY3JpYmUgPSBjb21wb3NlZFNpZ25hbCAmJiBjb21wb3NlZFNpZ25hbC51bnN1YnNjcmliZSAmJiAoKCkgPT4ge1xuICAgICAgY29tcG9zZWRTaWduYWwudW5zdWJzY3JpYmUoKTtcbiAgfSk7XG5cbiAgbGV0IHJlcXVlc3RDb250ZW50TGVuZ3RoO1xuXG4gIHRyeSB7XG4gICAgaWYgKFxuICAgICAgb25VcGxvYWRQcm9ncmVzcyAmJiBzdXBwb3J0c1JlcXVlc3RTdHJlYW0gJiYgbWV0aG9kICE9PSAnZ2V0JyAmJiBtZXRob2QgIT09ICdoZWFkJyAmJlxuICAgICAgKHJlcXVlc3RDb250ZW50TGVuZ3RoID0gYXdhaXQgcmVzb2x2ZUJvZHlMZW5ndGgoaGVhZGVycywgZGF0YSkpICE9PSAwXG4gICAgKSB7XG4gICAgICBsZXQgX3JlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGRhdGEsXG4gICAgICAgIGR1cGxleDogXCJoYWxmXCJcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgY29udGVudFR5cGVIZWFkZXI7XG5cbiAgICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpICYmIChjb250ZW50VHlwZUhlYWRlciA9IF9yZXF1ZXN0LmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkpIHtcbiAgICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZShjb250ZW50VHlwZUhlYWRlcilcbiAgICAgIH1cblxuICAgICAgaWYgKF9yZXF1ZXN0LmJvZHkpIHtcbiAgICAgICAgY29uc3QgW29uUHJvZ3Jlc3MsIGZsdXNoXSA9IHByb2dyZXNzRXZlbnREZWNvcmF0b3IoXG4gICAgICAgICAgcmVxdWVzdENvbnRlbnRMZW5ndGgsXG4gICAgICAgICAgcHJvZ3Jlc3NFdmVudFJlZHVjZXIoYXN5bmNEZWNvcmF0b3Iob25VcGxvYWRQcm9ncmVzcykpXG4gICAgICAgICk7XG5cbiAgICAgICAgZGF0YSA9IHRyYWNrU3RyZWFtKF9yZXF1ZXN0LmJvZHksIERFRkFVTFRfQ0hVTktfU0laRSwgb25Qcm9ncmVzcywgZmx1c2gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdXRpbHMuaXNTdHJpbmcod2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgd2l0aENyZWRlbnRpYWxzID0gd2l0aENyZWRlbnRpYWxzID8gJ2luY2x1ZGUnIDogJ29taXQnO1xuICAgIH1cblxuICAgIC8vIENsb3VkZmxhcmUgV29ya2VycyB0aHJvd3Mgd2hlbiBjcmVkZW50aWFscyBhcmUgZGVmaW5lZFxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY2xvdWRmbGFyZS93b3JrZXJkL2lzc3Vlcy85MDJcbiAgICBjb25zdCBpc0NyZWRlbnRpYWxzU3VwcG9ydGVkID0gXCJjcmVkZW50aWFsc1wiIGluIFJlcXVlc3QucHJvdG90eXBlO1xuICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIHtcbiAgICAgIC4uLmZldGNoT3B0aW9ucyxcbiAgICAgIHNpZ25hbDogY29tcG9zZWRTaWduYWwsXG4gICAgICBtZXRob2Q6IG1ldGhvZC50b1VwcGVyQ2FzZSgpLFxuICAgICAgaGVhZGVyczogaGVhZGVycy5ub3JtYWxpemUoKS50b0pTT04oKSxcbiAgICAgIGJvZHk6IGRhdGEsXG4gICAgICBkdXBsZXg6IFwiaGFsZlwiLFxuICAgICAgY3JlZGVudGlhbHM6IGlzQ3JlZGVudGlhbHNTdXBwb3J0ZWQgPyB3aXRoQ3JlZGVudGlhbHMgOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gICAgY29uc3QgaXNTdHJlYW1SZXNwb25zZSA9IHN1cHBvcnRzUmVzcG9uc2VTdHJlYW0gJiYgKHJlc3BvbnNlVHlwZSA9PT0gJ3N0cmVhbScgfHwgcmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKTtcblxuICAgIGlmIChzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmIChvbkRvd25sb2FkUHJvZ3Jlc3MgfHwgKGlzU3RyZWFtUmVzcG9uc2UgJiYgdW5zdWJzY3JpYmUpKSkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgICBbJ3N0YXR1cycsICdzdGF0dXNUZXh0JywgJ2hlYWRlcnMnXS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBvcHRpb25zW3Byb3BdID0gcmVzcG9uc2VbcHJvcF07XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzcG9uc2VDb250ZW50TGVuZ3RoID0gdXRpbHMudG9GaW5pdGVOdW1iZXIocmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtbGVuZ3RoJykpO1xuXG4gICAgICBjb25zdCBbb25Qcm9ncmVzcywgZmx1c2hdID0gb25Eb3dubG9hZFByb2dyZXNzICYmIHByb2dyZXNzRXZlbnREZWNvcmF0b3IoXG4gICAgICAgIHJlc3BvbnNlQ29udGVudExlbmd0aCxcbiAgICAgICAgcHJvZ3Jlc3NFdmVudFJlZHVjZXIoYXN5bmNEZWNvcmF0b3Iob25Eb3dubG9hZFByb2dyZXNzKSwgdHJ1ZSlcbiAgICAgICkgfHwgW107XG5cbiAgICAgIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKFxuICAgICAgICB0cmFja1N0cmVhbShyZXNwb25zZS5ib2R5LCBERUZBVUxUX0NIVU5LX1NJWkUsIG9uUHJvZ3Jlc3MsICgpID0+IHtcbiAgICAgICAgICBmbHVzaCAmJiBmbHVzaCgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlICYmIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pLFxuICAgICAgICBvcHRpb25zXG4gICAgICApO1xuICAgIH1cblxuICAgIHJlc3BvbnNlVHlwZSA9IHJlc3BvbnNlVHlwZSB8fCAndGV4dCc7XG5cbiAgICBsZXQgcmVzcG9uc2VEYXRhID0gYXdhaXQgcmVzb2x2ZXJzW3V0aWxzLmZpbmRLZXkocmVzb2x2ZXJzLCByZXNwb25zZVR5cGUpIHx8ICd0ZXh0J10ocmVzcG9uc2UsIGNvbmZpZyk7XG5cbiAgICAhaXNTdHJlYW1SZXNwb25zZSAmJiB1bnN1YnNjcmliZSAmJiB1bnN1YnNjcmliZSgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBoZWFkZXJzOiBBeGlvc0hlYWRlcnMuZnJvbShyZXNwb25zZS5oZWFkZXJzKSxcbiAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdFxuICAgICAgfSlcbiAgICB9KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB1bnN1YnNjcmliZSAmJiB1bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKGVyciAmJiBlcnIubmFtZSA9PT0gJ1R5cGVFcnJvcicgJiYgL2ZldGNoL2kudGVzdChlcnIubWVzc2FnZSkpIHtcbiAgICAgIHRocm93IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIG5ldyBBeGlvc0Vycm9yKCdOZXR3b3JrIEVycm9yJywgQXhpb3NFcnJvci5FUlJfTkVUV09SSywgY29uZmlnLCByZXF1ZXN0KSxcbiAgICAgICAge1xuICAgICAgICAgIGNhdXNlOiBlcnIuY2F1c2UgfHwgZXJyXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICB0aHJvdyBBeGlvc0Vycm9yLmZyb20oZXJyLCBlcnIgJiYgZXJyLmNvZGUsIGNvbmZpZywgcmVxdWVzdCk7XG4gIH1cbn0pO1xuXG5cbiIsICJpbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IGh0dHBBZGFwdGVyIGZyb20gJy4vaHR0cC5qcyc7XG5pbXBvcnQgeGhyQWRhcHRlciBmcm9tICcuL3hoci5qcyc7XG5pbXBvcnQgZmV0Y2hBZGFwdGVyIGZyb20gJy4vZmV0Y2guanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSBcIi4uL2NvcmUvQXhpb3NFcnJvci5qc1wiO1xuXG5jb25zdCBrbm93bkFkYXB0ZXJzID0ge1xuICBodHRwOiBodHRwQWRhcHRlcixcbiAgeGhyOiB4aHJBZGFwdGVyLFxuICBmZXRjaDogZmV0Y2hBZGFwdGVyXG59XG5cbnV0aWxzLmZvckVhY2goa25vd25BZGFwdGVycywgKGZuLCB2YWx1ZSkgPT4ge1xuICBpZiAoZm4pIHtcbiAgICB0cnkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCAnbmFtZScsIHt2YWx1ZX0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eVxuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sICdhZGFwdGVyTmFtZScsIHt2YWx1ZX0pO1xuICB9XG59KTtcblxuY29uc3QgcmVuZGVyUmVhc29uID0gKHJlYXNvbikgPT4gYC0gJHtyZWFzb259YDtcblxuY29uc3QgaXNSZXNvbHZlZEhhbmRsZSA9IChhZGFwdGVyKSA9PiB1dGlscy5pc0Z1bmN0aW9uKGFkYXB0ZXIpIHx8IGFkYXB0ZXIgPT09IG51bGwgfHwgYWRhcHRlciA9PT0gZmFsc2U7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0QWRhcHRlcjogKGFkYXB0ZXJzKSA9PiB7XG4gICAgYWRhcHRlcnMgPSB1dGlscy5pc0FycmF5KGFkYXB0ZXJzKSA/IGFkYXB0ZXJzIDogW2FkYXB0ZXJzXTtcblxuICAgIGNvbnN0IHtsZW5ndGh9ID0gYWRhcHRlcnM7XG4gICAgbGV0IG5hbWVPckFkYXB0ZXI7XG4gICAgbGV0IGFkYXB0ZXI7XG5cbiAgICBjb25zdCByZWplY3RlZFJlYXNvbnMgPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIG5hbWVPckFkYXB0ZXIgPSBhZGFwdGVyc1tpXTtcbiAgICAgIGxldCBpZDtcblxuICAgICAgYWRhcHRlciA9IG5hbWVPckFkYXB0ZXI7XG5cbiAgICAgIGlmICghaXNSZXNvbHZlZEhhbmRsZShuYW1lT3JBZGFwdGVyKSkge1xuICAgICAgICBhZGFwdGVyID0ga25vd25BZGFwdGVyc1soaWQgPSBTdHJpbmcobmFtZU9yQWRhcHRlcikpLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgICAgIGlmIChhZGFwdGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihgVW5rbm93biBhZGFwdGVyICcke2lkfSdgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYWRhcHRlcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmVqZWN0ZWRSZWFzb25zW2lkIHx8ICcjJyArIGldID0gYWRhcHRlcjtcbiAgICB9XG5cbiAgICBpZiAoIWFkYXB0ZXIpIHtcblxuICAgICAgY29uc3QgcmVhc29ucyA9IE9iamVjdC5lbnRyaWVzKHJlamVjdGVkUmVhc29ucylcbiAgICAgICAgLm1hcCgoW2lkLCBzdGF0ZV0pID0+IGBhZGFwdGVyICR7aWR9IGAgK1xuICAgICAgICAgIChzdGF0ZSA9PT0gZmFsc2UgPyAnaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgZW52aXJvbm1lbnQnIDogJ2lzIG5vdCBhdmFpbGFibGUgaW4gdGhlIGJ1aWxkJylcbiAgICAgICAgKTtcblxuICAgICAgbGV0IHMgPSBsZW5ndGggP1xuICAgICAgICAocmVhc29ucy5sZW5ndGggPiAxID8gJ3NpbmNlIDpcXG4nICsgcmVhc29ucy5tYXAocmVuZGVyUmVhc29uKS5qb2luKCdcXG4nKSA6ICcgJyArIHJlbmRlclJlYXNvbihyZWFzb25zWzBdKSkgOlxuICAgICAgICAnYXMgbm8gYWRhcHRlciBzcGVjaWZpZWQnO1xuXG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgYFRoZXJlIGlzIG5vIHN1aXRhYmxlIGFkYXB0ZXIgdG8gZGlzcGF0Y2ggdGhlIHJlcXVlc3QgYCArIHMsXG4gICAgICAgICdFUlJfTk9UX1NVUFBPUlQnXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBhZGFwdGVyO1xuICB9LFxuICBhZGFwdGVyczoga25vd25BZGFwdGVyc1xufVxuIiwgIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHRyYW5zZm9ybURhdGEgZnJvbSAnLi90cmFuc2Zvcm1EYXRhLmpzJztcbmltcG9ydCBpc0NhbmNlbCBmcm9tICcuLi9jYW5jZWwvaXNDYW5jZWwuanMnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL2luZGV4LmpzJztcbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4uL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi4vY29yZS9BeGlvc0hlYWRlcnMuanMnO1xuaW1wb3J0IGFkYXB0ZXJzIGZyb20gXCIuLi9hZGFwdGVycy9hZGFwdGVycy5qc1wiO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxlZEVycm9yYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG5cbiAgaWYgKGNvbmZpZy5zaWduYWwgJiYgY29uZmlnLnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgdGhyb3cgbmV3IENhbmNlbGVkRXJyb3IobnVsbCwgY29uZmlnKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIGNvbmZpZy5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oY29uZmlnLmhlYWRlcnMpO1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgY29uZmlnLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgaWYgKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXS5pbmRleE9mKGNvbmZpZy5tZXRob2QpICE9PSAtMSkge1xuICAgIGNvbmZpZy5oZWFkZXJzLnNldENvbnRlbnRUeXBlKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLCBmYWxzZSk7XG4gIH1cblxuICBjb25zdCBhZGFwdGVyID0gYWRhcHRlcnMuZ2V0QWRhcHRlcihjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyKTtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgIGNvbmZpZyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSxcbiAgICAgIHJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJlc3BvbnNlLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShyZXNwb25zZS5oZWFkZXJzKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShyZWFzb24ucmVzcG9uc2UuaGVhZGVycyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufVxuIiwgImV4cG9ydCBjb25zdCBWRVJTSU9OID0gXCIxLjcuN1wiOyIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7VkVSU0lPTn0gZnJvbSAnLi4vZW52L2RhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcblxuY29uc3QgdmFsaWRhdG9ycyA9IHt9O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuWydvYmplY3QnLCAnYm9vbGVhbicsICdudW1iZXInLCAnZnVuY3Rpb24nLCAnc3RyaW5nJywgJ3N5bWJvbCddLmZvckVhY2goKHR5cGUsIGkpID0+IHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbmNvbnN0IGRlcHJlY2F0ZWRXYXJuaW5ncyA9IHt9O1xuXG4vKipcbiAqIFRyYW5zaXRpb25hbCBvcHRpb24gdmFsaWRhdG9yXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yIC0gc2V0IHRvIGZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uYWwgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvbiAtIGRlcHJlY2F0ZWQgdmVyc2lvbiAvIHJlbW92ZWQgc2luY2UgdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIC0gc29tZSBtZXNzYWdlIHdpdGggYWRkaXRpb25hbCBpbmZvXG4gKlxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuICh2YWx1ZSwgb3B0LCBvcHRzKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKG9wdCwgJyBoYXMgYmVlbiByZW1vdmVkJyArICh2ZXJzaW9uID8gJyBpbiAnICsgdmVyc2lvbiA6ICcnKSksXG4gICAgICAgIEF4aW9zRXJyb3IuRVJSX0RFUFJFQ0FURURcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBhbGxvd1Vua25vd25cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0JywgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTl9WQUxVRSk7XG4gIH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGNvbnN0IG9wdCA9IGtleXNbaV07XG4gICAgY29uc3QgdmFsaWRhdG9yID0gc2NoZW1hW29wdF07XG4gICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhc3NlcnRPcHRpb25zLFxuICB2YWxpZGF0b3JzXG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IGJ1aWxkVVJMIGZyb20gJy4uL2hlbHBlcnMvYnVpbGRVUkwuanMnO1xuaW1wb3J0IEludGVyY2VwdG9yTWFuYWdlciBmcm9tICcuL0ludGVyY2VwdG9yTWFuYWdlci5qcyc7XG5pbXBvcnQgZGlzcGF0Y2hSZXF1ZXN0IGZyb20gJy4vZGlzcGF0Y2hSZXF1ZXN0LmpzJztcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tICcuL21lcmdlQ29uZmlnLmpzJztcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gJy4vYnVpbGRGdWxsUGF0aC5qcyc7XG5pbXBvcnQgdmFsaWRhdG9yIGZyb20gJy4uL2hlbHBlcnMvdmFsaWRhdG9yLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi9BeGlvc0hlYWRlcnMuanMnO1xuXG5jb25zdCB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnZhbGlkYXRvcnM7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmNsYXNzIEF4aW9zIHtcbiAgY29uc3RydWN0b3IoaW5zdGFuY2VDb25maWcpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gICAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBjb25maWdPclVybCBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gICAqIEBwYXJhbSB7P09iamVjdH0gY29uZmlnXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAgICovXG4gIGFzeW5jIHJlcXVlc3QoY29uZmlnT3JVcmwsIGNvbmZpZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBsZXQgZHVtbXk7XG5cbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgPyBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZShkdW1teSA9IHt9KSA6IChkdW1teSA9IG5ldyBFcnJvcigpKTtcblxuICAgICAgICAvLyBzbGljZSBvZmYgdGhlIEVycm9yOiAuLi4gbGluZVxuICAgICAgICBjb25zdCBzdGFjayA9IGR1bW15LnN0YWNrID8gZHVtbXkuc3RhY2sucmVwbGFjZSgvXi4rXFxuLywgJycpIDogJyc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCFlcnIuc3RhY2spIHtcbiAgICAgICAgICAgIGVyci5zdGFjayA9IHN0YWNrO1xuICAgICAgICAgICAgLy8gbWF0Y2ggd2l0aG91dCB0aGUgMiB0b3Agc3RhY2sgbGluZXNcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YWNrICYmICFTdHJpbmcoZXJyLnN0YWNrKS5lbmRzV2l0aChzdGFjay5yZXBsYWNlKC9eLitcXG4uK1xcbi8sICcnKSkpIHtcbiAgICAgICAgICAgIGVyci5zdGFjayArPSAnXFxuJyArIHN0YWNrXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaWdub3JlIHRoZSBjYXNlIHdoZXJlIFwic3RhY2tcIiBpcyBhbiB1bi13cml0YWJsZSBwcm9wZXJ0eVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBfcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICAgIGlmICh0eXBlb2YgY29uZmlnT3JVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgICBjb25maWcudXJsID0gY29uZmlnT3JVcmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ09yVXJsIHx8IHt9O1xuICAgIH1cblxuICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICBjb25zdCB7dHJhbnNpdGlvbmFsLCBwYXJhbXNTZXJpYWxpemVyLCBoZWFkZXJzfSA9IGNvbmZpZztcblxuICAgIGlmICh0cmFuc2l0aW9uYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICAgIHNpbGVudEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICBmb3JjZWRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXNTZXJpYWxpemVyICE9IG51bGwpIHtcbiAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcmFtc1NlcmlhbGl6ZXIpKSB7XG4gICAgICAgIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyID0ge1xuICAgICAgICAgIHNlcmlhbGl6ZTogcGFyYW1zU2VyaWFsaXplclxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyhwYXJhbXNTZXJpYWxpemVyLCB7XG4gICAgICAgICAgZW5jb2RlOiB2YWxpZGF0b3JzLmZ1bmN0aW9uLFxuICAgICAgICAgIHNlcmlhbGl6ZTogdmFsaWRhdG9ycy5mdW5jdGlvblxuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICAgIGNvbmZpZy5tZXRob2QgPSAoY29uZmlnLm1ldGhvZCB8fCB0aGlzLmRlZmF1bHRzLm1ldGhvZCB8fCAnZ2V0JykudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICAgIGxldCBjb250ZXh0SGVhZGVycyA9IGhlYWRlcnMgJiYgdXRpbHMubWVyZ2UoXG4gICAgICBoZWFkZXJzLmNvbW1vbixcbiAgICAgIGhlYWRlcnNbY29uZmlnLm1ldGhvZF1cbiAgICApO1xuXG4gICAgaGVhZGVycyAmJiB1dGlscy5mb3JFYWNoKFxuICAgICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgICAobWV0aG9kKSA9PiB7XG4gICAgICAgIGRlbGV0ZSBoZWFkZXJzW21ldGhvZF07XG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbmZpZy5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmNvbmNhdChjb250ZXh0SGVhZGVycywgaGVhZGVycyk7XG5cbiAgICAvLyBmaWx0ZXIgb3V0IHNraXBwZWQgaW50ZXJjZXB0b3JzXG4gICAgY29uc3QgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICBsZXQgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gdHJ1ZTtcbiAgICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICAgIGlmICh0eXBlb2YgaW50ZXJjZXB0b3IucnVuV2hlbiA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnRlcmNlcHRvci5ydW5XaGVuKGNvbmZpZykgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzICYmIGludGVyY2VwdG9yLnN5bmNocm9ub3VzO1xuXG4gICAgICByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluID0gW107XG4gICAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICAgIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgbGV0IHByb21pc2U7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBsZW47XG5cbiAgICBpZiAoIXN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycykge1xuICAgICAgY29uc3QgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LmJpbmQodGhpcyksIHVuZGVmaW5lZF07XG4gICAgICBjaGFpbi51bnNoaWZ0LmFwcGx5KGNoYWluLCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbik7XG4gICAgICBjaGFpbi5wdXNoLmFwcGx5KGNoYWluLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuICAgICAgbGVuID0gY2hhaW4ubGVuZ3RoO1xuXG4gICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW5baSsrXSwgY2hhaW5baSsrXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGxlbiA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLmxlbmd0aDtcblxuICAgIGxldCBuZXdDb25maWcgPSBjb25maWc7XG5cbiAgICBpID0gMDtcblxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICBjb25zdCBvbkZ1bGZpbGxlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluW2krK107XG4gICAgICBjb25zdCBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW5baSsrXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ld0NvbmZpZyA9IG9uRnVsZmlsbGVkKG5ld0NvbmZpZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBvblJlamVjdGVkLmNhbGwodGhpcywgZXJyb3IpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcHJvbWlzZSA9IGRpc3BhdGNoUmVxdWVzdC5jYWxsKHRoaXMsIG5ld0NvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfVxuXG4gICAgaSA9IDA7XG4gICAgbGVuID0gcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLmxlbmd0aDtcblxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbltpKytdLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW5baSsrXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBnZXRVcmkoY29uZmlnKSB7XG4gICAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJldHVybiBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpO1xuICB9XG59XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kLFxuICAgICAgdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlSFRUUE1ldGhvZChpc0Zvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaHR0cE1ldGhvZCh1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzOiBpc0Zvcm0gPyB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xuICAgICAgICB9IDoge30sXG4gICAgICAgIHVybCxcbiAgICAgICAgZGF0YVxuICAgICAgfSkpO1xuICAgIH07XG4gIH1cblxuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCgpO1xuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2QgKyAnRm9ybSddID0gZ2VuZXJhdGVIVFRQTWV0aG9kKHRydWUpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi9DYW5jZWxlZEVycm9yLmpzJztcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Q2FuY2VsVG9rZW59XG4gKi9cbmNsYXNzIENhbmNlbFRva2VuIHtcbiAgY29uc3RydWN0b3IoZXhlY3V0b3IpIHtcbiAgICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlc29sdmVQcm9taXNlO1xuXG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRva2VuID0gdGhpcztcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgdGhpcy5wcm9taXNlLnRoZW4oY2FuY2VsID0+IHtcbiAgICAgIGlmICghdG9rZW4uX2xpc3RlbmVycykgcmV0dXJuO1xuXG4gICAgICBsZXQgaSA9IHRva2VuLl9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgICB0b2tlbi5fbGlzdGVuZXJzW2ldKGNhbmNlbCk7XG4gICAgICB9XG4gICAgICB0b2tlbi5fbGlzdGVuZXJzID0gbnVsbDtcbiAgICB9KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgdGhpcy5wcm9taXNlLnRoZW4gPSBvbmZ1bGZpbGxlZCA9PiB7XG4gICAgICBsZXQgX3Jlc29sdmU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0b2tlbi5zdWJzY3JpYmUocmVzb2x2ZSk7XG4gICAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIH0pLnRoZW4ob25mdWxmaWxsZWQpO1xuXG4gICAgICBwcm9taXNlLmNhbmNlbCA9IGZ1bmN0aW9uIHJlamVjdCgpIHtcbiAgICAgICAgdG9rZW4udW5zdWJzY3JpYmUoX3Jlc29sdmUpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpIHtcbiAgICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbGVkRXJyb3IobWVzc2FnZSwgY29uZmlnLCByZXF1ZXN0KTtcbiAgICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGEgYENhbmNlbGVkRXJyb3JgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gICAqL1xuICB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICAgIGlmICh0aGlzLnJlYXNvbikge1xuICAgICAgdGhyb3cgdGhpcy5yZWFzb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZSB0byB0aGUgY2FuY2VsIHNpZ25hbFxuICAgKi9cblxuICBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICAgIGxpc3RlbmVyKHRoaXMucmVhc29uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlIGZyb20gdGhlIGNhbmNlbCBzaWduYWxcbiAgICovXG5cbiAgdW5zdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICB0b0Fib3J0U2lnbmFsKCkge1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICBjb25zdCBhYm9ydCA9IChlcnIpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuYWJvcnQoZXJyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdWJzY3JpYmUoYWJvcnQpO1xuXG4gICAgY29udHJvbGxlci5zaWduYWwudW5zdWJzY3JpYmUgPSAoKSA9PiB0aGlzLnVuc3Vic2NyaWJlKGFib3J0KTtcblxuICAgIHJldHVybiBjb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gICAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gICAqL1xuICBzdGF0aWMgc291cmNlKCkge1xuICAgIGxldCBjYW5jZWw7XG4gICAgY29uc3QgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgICAgY2FuY2VsID0gYztcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW4sXG4gICAgICBjYW5jZWxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbmNlbFRva2VuO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiB1dGlscy5pc09iamVjdChwYXlsb2FkKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufVxuIiwgImNvbnN0IEh0dHBTdGF0dXNDb2RlID0ge1xuICBDb250aW51ZTogMTAwLFxuICBTd2l0Y2hpbmdQcm90b2NvbHM6IDEwMSxcbiAgUHJvY2Vzc2luZzogMTAyLFxuICBFYXJseUhpbnRzOiAxMDMsXG4gIE9rOiAyMDAsXG4gIENyZWF0ZWQ6IDIwMSxcbiAgQWNjZXB0ZWQ6IDIwMixcbiAgTm9uQXV0aG9yaXRhdGl2ZUluZm9ybWF0aW9uOiAyMDMsXG4gIE5vQ29udGVudDogMjA0LFxuICBSZXNldENvbnRlbnQ6IDIwNSxcbiAgUGFydGlhbENvbnRlbnQ6IDIwNixcbiAgTXVsdGlTdGF0dXM6IDIwNyxcbiAgQWxyZWFkeVJlcG9ydGVkOiAyMDgsXG4gIEltVXNlZDogMjI2LFxuICBNdWx0aXBsZUNob2ljZXM6IDMwMCxcbiAgTW92ZWRQZXJtYW5lbnRseTogMzAxLFxuICBGb3VuZDogMzAyLFxuICBTZWVPdGhlcjogMzAzLFxuICBOb3RNb2RpZmllZDogMzA0LFxuICBVc2VQcm94eTogMzA1LFxuICBVbnVzZWQ6IDMwNixcbiAgVGVtcG9yYXJ5UmVkaXJlY3Q6IDMwNyxcbiAgUGVybWFuZW50UmVkaXJlY3Q6IDMwOCxcbiAgQmFkUmVxdWVzdDogNDAwLFxuICBVbmF1dGhvcml6ZWQ6IDQwMSxcbiAgUGF5bWVudFJlcXVpcmVkOiA0MDIsXG4gIEZvcmJpZGRlbjogNDAzLFxuICBOb3RGb3VuZDogNDA0LFxuICBNZXRob2ROb3RBbGxvd2VkOiA0MDUsXG4gIE5vdEFjY2VwdGFibGU6IDQwNixcbiAgUHJveHlBdXRoZW50aWNhdGlvblJlcXVpcmVkOiA0MDcsXG4gIFJlcXVlc3RUaW1lb3V0OiA0MDgsXG4gIENvbmZsaWN0OiA0MDksXG4gIEdvbmU6IDQxMCxcbiAgTGVuZ3RoUmVxdWlyZWQ6IDQxMSxcbiAgUHJlY29uZGl0aW9uRmFpbGVkOiA0MTIsXG4gIFBheWxvYWRUb29MYXJnZTogNDEzLFxuICBVcmlUb29Mb25nOiA0MTQsXG4gIFVuc3VwcG9ydGVkTWVkaWFUeXBlOiA0MTUsXG4gIFJhbmdlTm90U2F0aXNmaWFibGU6IDQxNixcbiAgRXhwZWN0YXRpb25GYWlsZWQ6IDQxNyxcbiAgSW1BVGVhcG90OiA0MTgsXG4gIE1pc2RpcmVjdGVkUmVxdWVzdDogNDIxLFxuICBVbnByb2Nlc3NhYmxlRW50aXR5OiA0MjIsXG4gIExvY2tlZDogNDIzLFxuICBGYWlsZWREZXBlbmRlbmN5OiA0MjQsXG4gIFRvb0Vhcmx5OiA0MjUsXG4gIFVwZ3JhZGVSZXF1aXJlZDogNDI2LFxuICBQcmVjb25kaXRpb25SZXF1aXJlZDogNDI4LFxuICBUb29NYW55UmVxdWVzdHM6IDQyOSxcbiAgUmVxdWVzdEhlYWRlckZpZWxkc1Rvb0xhcmdlOiA0MzEsXG4gIFVuYXZhaWxhYmxlRm9yTGVnYWxSZWFzb25zOiA0NTEsXG4gIEludGVybmFsU2VydmVyRXJyb3I6IDUwMCxcbiAgTm90SW1wbGVtZW50ZWQ6IDUwMSxcbiAgQmFkR2F0ZXdheTogNTAyLFxuICBTZXJ2aWNlVW5hdmFpbGFibGU6IDUwMyxcbiAgR2F0ZXdheVRpbWVvdXQ6IDUwNCxcbiAgSHR0cFZlcnNpb25Ob3RTdXBwb3J0ZWQ6IDUwNSxcbiAgVmFyaWFudEFsc29OZWdvdGlhdGVzOiA1MDYsXG4gIEluc3VmZmljaWVudFN0b3JhZ2U6IDUwNyxcbiAgTG9vcERldGVjdGVkOiA1MDgsXG4gIE5vdEV4dGVuZGVkOiA1MTAsXG4gIE5ldHdvcmtBdXRoZW50aWNhdGlvblJlcXVpcmVkOiA1MTEsXG59O1xuXG5PYmplY3QuZW50cmllcyhIdHRwU3RhdHVzQ29kZSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gIEh0dHBTdGF0dXNDb2RlW3ZhbHVlXSA9IGtleTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIdHRwU3RhdHVzQ29kZTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCBiaW5kIGZyb20gJy4vaGVscGVycy9iaW5kLmpzJztcbmltcG9ydCBBeGlvcyBmcm9tICcuL2NvcmUvQXhpb3MuanMnO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gJy4vY29yZS9tZXJnZUNvbmZpZy5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgZm9ybURhdGFUb0pTT04gZnJvbSAnLi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzJztcbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbFRva2VuIGZyb20gJy4vY2FuY2VsL0NhbmNlbFRva2VuLmpzJztcbmltcG9ydCBpc0NhbmNlbCBmcm9tICcuL2NhbmNlbC9pc0NhbmNlbC5qcyc7XG5pbXBvcnQge1ZFUlNJT059IGZyb20gJy4vZW52L2RhdGEuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi9oZWxwZXJzL3RvRm9ybURhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IHNwcmVhZCBmcm9tICcuL2hlbHBlcnMvc3ByZWFkLmpzJztcbmltcG9ydCBpc0F4aW9zRXJyb3IgZnJvbSAnLi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL2NvcmUvQXhpb3NIZWFkZXJzLmpzXCI7XG5pbXBvcnQgYWRhcHRlcnMgZnJvbSAnLi9hZGFwdGVycy9hZGFwdGVycy5qcyc7XG5pbXBvcnQgSHR0cFN0YXR1c0NvZGUgZnJvbSAnLi9oZWxwZXJzL0h0dHBTdGF0dXNDb2RlLmpzJztcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm5zIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICBjb25zdCBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICBjb25zdCBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0LCB7YWxsT3duS2V5czogdHJ1ZX0pO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQsIG51bGwsIHthbGxPd25LZXlzOiB0cnVlfSk7XG5cbiAgLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuICBpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgaW5zdGFuY2VDb25maWcpKTtcbiAgfTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxuY29uc3QgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWxlZEVycm9yID0gQ2FuY2VsZWRFcnJvcjtcbmF4aW9zLkNhbmNlbFRva2VuID0gQ2FuY2VsVG9rZW47XG5heGlvcy5pc0NhbmNlbCA9IGlzQ2FuY2VsO1xuYXhpb3MuVkVSU0lPTiA9IFZFUlNJT047XG5heGlvcy50b0Zvcm1EYXRhID0gdG9Gb3JtRGF0YTtcblxuLy8gRXhwb3NlIEF4aW9zRXJyb3IgY2xhc3NcbmF4aW9zLkF4aW9zRXJyb3IgPSBBeGlvc0Vycm9yO1xuXG4vLyBhbGlhcyBmb3IgQ2FuY2VsZWRFcnJvciBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuYXhpb3MuQ2FuY2VsID0gYXhpb3MuQ2FuY2VsZWRFcnJvcjtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcblxuYXhpb3Muc3ByZWFkID0gc3ByZWFkO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSBpc0F4aW9zRXJyb3I7XG5cbi8vIEV4cG9zZSBtZXJnZUNvbmZpZ1xuYXhpb3MubWVyZ2VDb25maWcgPSBtZXJnZUNvbmZpZztcblxuYXhpb3MuQXhpb3NIZWFkZXJzID0gQXhpb3NIZWFkZXJzO1xuXG5heGlvcy5mb3JtVG9KU09OID0gdGhpbmcgPT4gZm9ybURhdGFUb0pTT04odXRpbHMuaXNIVE1MRm9ybSh0aGluZykgPyBuZXcgRm9ybURhdGEodGhpbmcpIDogdGhpbmcpO1xuXG5heGlvcy5nZXRBZGFwdGVyID0gYWRhcHRlcnMuZ2V0QWRhcHRlcjtcblxuYXhpb3MuSHR0cFN0YXR1c0NvZGUgPSBIdHRwU3RhdHVzQ29kZTtcblxuYXhpb3MuZGVmYXVsdCA9IGF4aW9zO1xuXG4vLyB0aGlzIG1vZHVsZSBzaG91bGQgb25seSBoYXZlIGEgZGVmYXVsdCBleHBvcnRcbmV4cG9ydCBkZWZhdWx0IGF4aW9zXG4iLCAiaW1wb3J0IGF4aW9zIGZyb20gJy4vbGliL2F4aW9zLmpzJztcblxuLy8gVGhpcyBtb2R1bGUgaXMgaW50ZW5kZWQgdG8gdW53cmFwIEF4aW9zIGRlZmF1bHQgZXhwb3J0IGFzIG5hbWVkLlxuLy8gS2VlcCB0b3AtbGV2ZWwgZXhwb3J0IHNhbWUgd2l0aCBzdGF0aWMgcHJvcGVydGllc1xuLy8gc28gdGhhdCBpdCBjYW4ga2VlcCBzYW1lIHdpdGggZXMgbW9kdWxlIG9yIGNqc1xuY29uc3Qge1xuICBBeGlvcyxcbiAgQXhpb3NFcnJvcixcbiAgQ2FuY2VsZWRFcnJvcixcbiAgaXNDYW5jZWwsXG4gIENhbmNlbFRva2VuLFxuICBWRVJTSU9OLFxuICBhbGwsXG4gIENhbmNlbCxcbiAgaXNBeGlvc0Vycm9yLFxuICBzcHJlYWQsXG4gIHRvRm9ybURhdGEsXG4gIEF4aW9zSGVhZGVycyxcbiAgSHR0cFN0YXR1c0NvZGUsXG4gIGZvcm1Ub0pTT04sXG4gIGdldEFkYXB0ZXIsXG4gIG1lcmdlQ29uZmlnXG59ID0gYXhpb3M7XG5cbmV4cG9ydCB7XG4gIGF4aW9zIGFzIGRlZmF1bHQsXG4gIEF4aW9zLFxuICBBeGlvc0Vycm9yLFxuICBDYW5jZWxlZEVycm9yLFxuICBpc0NhbmNlbCxcbiAgQ2FuY2VsVG9rZW4sXG4gIFZFUlNJT04sXG4gIGFsbCxcbiAgQ2FuY2VsLFxuICBpc0F4aW9zRXJyb3IsXG4gIHNwcmVhZCxcbiAgdG9Gb3JtRGF0YSxcbiAgQXhpb3NIZWFkZXJzLFxuICBIdHRwU3RhdHVzQ29kZSxcbiAgZm9ybVRvSlNPTixcbiAgZ2V0QWRhcHRlcixcbiAgbWVyZ2VDb25maWdcbn1cbiIsICJpbXBvcnQgeyBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBCYXNlU2V0dGluZyBmcm9tIFwiLi9iYXNlLXNldHRpbmdcIjtcclxuaW1wb3J0IHsgTGFuZ0JBSURVIH0gZnJvbSBcInNyYy9kYXRhL3R5cGVzXCI7XHJcbmltcG9ydCB7IHQgfSBmcm9tIFwic3JjL2xhbmcvaW54ZGV4XCI7XHJcblxyXG5jb25zdCBmcm9tX2xhbmc6IExhbmdCQUlEVSA9IHtcclxuICAgICdhdXRvJzogJ1x1ODFFQVx1NTJBOFx1NjhDMFx1NkQ0QicsXHJcbiAgICAnemgnOiAnXHU0RTJEXHU2NTg3JyxcclxuICAgICdjaHQnOiAnXHU3RTQxXHU0RjUzXHU0RTJEXHU2NTg3JyxcclxuICAgICd5dWUnOiAnXHU3Q0E0XHU4QkVEJyxcclxuICAgICd3eXcnOiAnXHU2NTg3XHU4QTAwXHU2NTg3JyxcclxuICAgICdlbic6ICdcdTgyRjFcdThCRUQnLFxyXG4gICAgJ2pwJzogJ1x1NjVFNVx1OEJFRCcsXHJcbiAgICAna29yJzogJ1x1OTdFOVx1OEJFRCcsXHJcbiAgICAnZnJhJzogJ1x1NkNENVx1OEJFRCcsXHJcbiAgICAnc3BhJzogJ1x1ODk3Rlx1NzNFRFx1NzI1OVx1OEJFRCcsXHJcbiAgICAndGgnOiAnXHU2Q0YwXHU4QkVEJyxcclxuICAgICdhcmEnOiAnXHU5NjNGXHU2MkM5XHU0RjJGXHU4QkVEJyxcclxuICAgICdydSc6ICdcdTRGQzRcdThCRUQnLFxyXG4gICAgJ3B0JzogJ1x1ODQ2MVx1ODQwNFx1NzI1OVx1OEJFRCcsXHJcbiAgICAnZGUnOiAnXHU1RkI3XHU4QkVEJyxcclxuICAgICdpdCc6ICdcdTYxMEZcdTU5MjdcdTUyMjlcdThCRUQnLFxyXG4gICAgJ2VsJzogJ1x1NUUwQ1x1ODE0QVx1OEJFRCcsXHJcbiAgICAnbmwnOiAnXHU4Mzc3XHU1MTcwXHU4QkVEJyxcclxuICAgICdwbCc6ICdcdTZDRTJcdTUxNzBcdThCRUQnLFxyXG4gICAgJ2J1bCc6ICdcdTRGRERcdTUyQTBcdTUyMjlcdTRFOUFcdThCRUQnLFxyXG4gICAgJ2VzdCc6ICdcdTcyMzFcdTZDOTlcdTVDM0NcdTRFOUFcdThCRUQnLFxyXG4gICAgJ2Rhbic6ICdcdTRFMzlcdTlFQTZcdThCRUQnLFxyXG4gICAgJ2Zpbic6ICdcdTgyQUNcdTUxNzBcdThCRUQnLFxyXG4gICAgJ2NzJzogJ1x1NjM3N1x1NTE0Qlx1OEJFRCcsXHJcbiAgICAncm9tJzogJ1x1N0Y1N1x1OUE2Q1x1NUMzQ1x1NEU5QVx1OEJFRCcsXHJcbiAgICAnc2xvJzogJ1x1NjVBRlx1NkQxQlx1NjU4N1x1NUMzQ1x1NEU5QVx1OEJFRCcsXHJcbiAgICAnc3dlJzogJ1x1NzQ1RVx1NTE3OFx1OEJFRCcsXHJcbiAgICAnaHUnOiAnXHU1MzA4XHU3MjU5XHU1MjI5XHU4QkVEJyxcclxuICAgICd2aWUnOiAnXHU4RDhBXHU1MzU3XHU4QkVEJ1xyXG59O1xyXG5jb25zdCB0b19sYW5nOiBMYW5nQkFJRFUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGZyb21fbGFuZykpO1xyXG5kZWxldGUgdG9fbGFuZy5hdXRvXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJMThuTml0QmFpRHUgZXh0ZW5kcyBCYXNlU2V0dGluZyB7XHJcbiAgICBtYWluKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGkxOG5OaXRCYWlEdSA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIGkxOG5OaXRCYWlEdS5zZXROYW1lKHQoJ1NFVFRJTkdfTklUX0JBSURVJykpO1xyXG4gICAgICAgIGkxOG5OaXRCYWlEdS5zZXREZXNjKHQoJ1NFVFRJTkdfTklUX0JBSURVX0RFU0MnKSk7XHJcbiAgICAgICAgaWYgKCEodGhpcy5zZXR0aW5ncy5JMThOX01PREVfTklUKSkgaTE4bk5pdEJhaUR1LnNldENsYXNzKCdpMThuX2Rpc3BsYXktbm9uZScpO1xyXG4gICAgICAgIGlmICghKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJID09ICdCQUlEVScpKSBpMThuTml0QmFpRHUuc2V0Q2xhc3MoJ2kxOG5fZGlzcGxheS1ub25lJyk7XHJcbiAgICAgICAgLy8gRlJPTVxyXG4gICAgICAgIGkxOG5OaXRCYWlEdS5hZGREcm9wZG93bihjYiA9PiBjYlxyXG4gICAgICAgICAgICAuYWRkT3B0aW9ucyhmcm9tX2xhbmcpXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLkkxOE5fTklUX0FQSVMuQkFJRFUuRlJPTSlcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX05JVF9BUElTLkJBSURVLkZST00gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gVE9cclxuICAgICAgICBpMThuTml0QmFpRHUuYWRkRHJvcGRvd24oY2IgPT4gY2JcclxuICAgICAgICAgICAgLmFkZE9wdGlvbnModG9fbGFuZylcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJUy5CQUlEVS5UTylcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX05JVF9BUElTLkJBSURVLlRPID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIEFQUElEXHJcbiAgICAgICAgaTE4bk5pdEJhaUR1LmFkZFRleHQoY2IgPT4gY2JcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJUy5CQUlEVS5BUFBfSUQpXHJcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignQVBQSUQnKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fTklUX0FQSVMuQkFJRFUuQVBQX0lEID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIEtFWVxyXG4gICAgICAgIGkxOG5OaXRCYWlEdS5hZGRUZXh0KGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLkkxOE5fTklUX0FQSVMuQkFJRFUuS0VZKVxyXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ0tFWScpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJUy5CQUlEVS5LRVkgPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCAiaW1wb3J0IHsgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgQmFzZVNldHRpbmcgZnJvbSBcIi4vYmFzZS1zZXR0aW5nXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSTE4bkF1dGhvciBleHRlbmRzIEJhc2VTZXR0aW5nIHtcclxuICAgIG1haW4oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaTE4bkF1dGhvciA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIGkxOG5BdXRob3Iuc2V0TmFtZSgnXHU4QkQxXHU2NTg3XHU3QjdFXHU1NDBEJyk7XHJcbiAgICAgICAgaTE4bkF1dGhvci5zZXREZXNjKCdcdTc1MUZcdTYyMTBcdThCRDFcdTY1ODdcdTY1RjZcdTgxRUFcdTUyQThcdTZERkJcdTUyQTBcdTRGNUNcdTgwMDVcdTdCN0VcdTU0MEQnKTtcclxuICAgICAgICBpMThuQXV0aG9yLmFkZFRleHQoY2IgPT4gY2JcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9BVVRIT1IpXHJcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignXHU3QjdFXHU1NDBEJylcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX0FVVEhPUiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCAiaW1wb3J0IHsgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgQmFzZVNldHRpbmcgZnJvbSBcIi4vYmFzZS1zZXR0aW5nXCI7XHJcblxyXG4vLyBcdTYyNTNcdTVGMDBcdThCQkVcdTdGNkVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSTE4bk9wZW5TZXR0aW5ncyBleHRlbmRzIEJhc2VTZXR0aW5nIHtcclxuICAgIG1haW4oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaTE4bk9wZW5TZXR0aW5ncyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIGkxOG5PcGVuU2V0dGluZ3Muc2V0TmFtZShcIlx1NjI1M1x1NUYwMFx1OEJCRVx1N0Y2RVwiKTtcclxuICAgICAgICBpMThuT3BlblNldHRpbmdzLnNldERlc2MoXCJcdTU0MkZcdTc1MjhcdTU0MEVcdTYzRDJcdTRFRjZcdTk4NzVcdTk3NjJcdTRFMkRcdTRGMUFcdTY2M0VcdTc5M0FcdThCQkVcdTdGNkVcdThERjNcdThGNkNcdTYzMDlcdTk0QUVcIik7XHJcbiAgICAgICAgaTE4bk9wZW5TZXR0aW5ncy5hZGRUb2dnbGUoY2IgPT4gY2JcclxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9PUEVOX1NFVFRJTkdTKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX09QRU5fU0VUVElOR1MgPSAhdGhpcy5zZXR0aW5ncy5JMThOX09QRU5fU0VUVElOR1M7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdUYWIuZGlzcGxheSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCAiaW1wb3J0IHsgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgQmFzZVNldHRpbmcgZnJvbSBcIi4vYmFzZS1zZXR0aW5nXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJMThuTklUT3BlbkFJIGV4dGVuZHMgQmFzZVNldHRpbmcge1xyXG4gICAgbWFpbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpMThuTklUT3BlbkFJID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCk7XHJcbiAgICAgICAgaTE4bk5JVE9wZW5BSS5zZXROYW1lKCdcdTU3MzBcdTU3NDAnKTtcclxuICAgICAgICBpMThuTklUT3BlbkFJLnNldERlc2MoJ1x1NEY3Rlx1NzUyOG9wZW5haVx1OEZEQlx1ODg0Q1x1N0ZGQlx1OEJEMScpO1xyXG4gICAgICAgIGlmICghKHRoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFX05JVCkpIGkxOG5OSVRPcGVuQUkuc2V0Q2xhc3MoJ2kxOG5fZGlzcGxheS1ub25lJyk7XHJcbiAgICAgICAgaWYgKCEodGhpcy5zZXR0aW5ncy5JMThOX05JVF9BUEkgPT0gJ09QRU5BSScpKSBpMThuTklUT3BlbkFJLnNldENsYXNzKCdpMThuX2Rpc3BsYXktbm9uZScpO1xyXG4gICAgICAgIGkxOG5OSVRPcGVuQUkuYWRkVGV4dChjYiA9PiBjYlxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX05JVF9PUEVOQUlfVVJMKVxyXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ2h0dHBzOi8vYXBpLm9wZW5haS5jb20nKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fTklUX09QRU5BSV9VUkwgPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaTE4bk5JVE9wZW5BSS5hZGRUZXh0KGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLkkxOE5fTklUX09QRU5BSV9LRVkpXHJcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignS0VZJylcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX05JVF9PUEVOQUlfS0VZID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICAgIGkxOG5OSVRPcGVuQUkuYWRkVGV4dChjYiA9PiBjYlxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX05JVF9PUEVOQUlfTU9ERUwpXHJcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignXHU2QTIxXHU1NzhCJylcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX05JVF9PUEVOQUlfTU9ERUwgPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGkxOG5BSU9wZW5BSVRpcHMgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICBpZiAoISh0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9OSVQpKSBpMThuQUlPcGVuQUlUaXBzLnNldENsYXNzKCdpMThuX2Rpc3BsYXktbm9uZScpO1xyXG4gICAgICAgIGlmICghKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJID09ICdPUEVOQUknKSkgaTE4bkFJT3BlbkFJVGlwcy5zZXRDbGFzcygnaTE4bl9kaXNwbGF5LW5vbmUnKTtcclxuICAgICAgICBpMThuQUlPcGVuQUlUaXBzLnNldE5hbWUoJ1x1NjNEMFx1NzkzQScpO1xyXG4gICAgICAgIGkxOG5BSU9wZW5BSVRpcHMuc2V0RGVzYygnXHU1MzczcHJvbXB0XHVGRjBDXHU3NTI4XHU0RThFXHU2MzA3XHU1QkZDQUlcdTU5ODJcdTRGNTVcdTdGRkJcdThCRDFcdUZGMENcdTY3MkNcdTYzRDJcdTRFRjZcdTYzRDBcdTRGOUJcdTlFRDhcdThCQTRcdTYzRDBcdTc5M0FcdThCQ0RcdUZGMENcdTU5ODJcdTY3MDlcdTk3MDBcdTg5ODFcdTUzRUZcdTgxRUFcdTg4NENcdThDMDNcdTY1NzRcdTMwMDInKTtcclxuICAgICAgICBpMThuQUlPcGVuQUlUaXBzLmFkZFRleHRBcmVhKGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLkkxOE5fTklUX09QRU5BSV9USVBTKVxyXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ1x1NjNEMFx1NzkzQVx1OEJDRCcpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfT1BFTkFJX1RJUFMgPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCAiaW1wb3J0IHsgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgQmFzZVNldHRpbmcgZnJvbSBcIi4vYmFzZS1zZXR0aW5nXCI7XHJcblxyXG4vLyBcdTgxRUFcdTUyQThcdTY2RjRcdTY1QjBcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSTE4bkVkaXRNb2RlIGV4dGVuZHMgQmFzZVNldHRpbmcge1xyXG4gICAgbWFpbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpMThuRWRpdE1vZGUgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICBpMThuRWRpdE1vZGUuc2V0TmFtZShcIlx1OEJEMVx1NjU4N1x1N0YxNlx1OEY5MVwiKTtcclxuICAgICAgICBpMThuRWRpdE1vZGUuc2V0RGVzYyhcIlx1NTQyRlx1NzUyOC9cdTc5ODFcdTc1MjhcdTUxODVcdTdGNkVcdThCRDFcdTY1ODdcdTdGMTZcdThGOTFcdTU2NjhcdTUyOUZcdTgwRkRcIik7XHJcbiAgICAgICAgaTE4bkVkaXRNb2RlLmFkZFRvZ2dsZShjYiA9PiBjYlxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX0VESVRfTU9ERSlcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9FRElUX01PREUgPSAhdGhpcy5zZXR0aW5ncy5JMThOX0VESVRfTU9ERTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBCYXNlU2V0dGluZyBmcm9tIFwiLi9iYXNlLXNldHRpbmdcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEkxOG5TdWJtaXRlVHJhbnNsYXRpb25Nb2RlIGV4dGVuZHMgQmFzZVNldHRpbmcge1xyXG4gICAgbWFpbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpMThuU3VibWl0ZVRyYW5zbGF0aW9uTW9kZSA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIGkxOG5TdWJtaXRlVHJhbnNsYXRpb25Nb2RlLnNldE5hbWUoXCJcdThCRDFcdTY1ODdcdTYzRDBcdTRFQTRcIik7XHJcbiAgICAgICAgaTE4blN1Ym1pdGVUcmFuc2xhdGlvbk1vZGUuc2V0RGVzYyhcIlx1NEUwMFx1OTUyRVx1NTNEMVx1OTAwMVx1OEJEMVx1NjU4N1x1ODFGM1x1NEY1Q1x1ODAwNShcdThCRjdcdTUyRkZcdTZFRTVcdTc1MjgpXCIpO1xyXG4gICAgICAgIGkxOG5TdWJtaXRlVHJhbnNsYXRpb25Nb2RlLmFkZFRvZ2dsZShjYiA9PiBjYlxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX1NVQk1JVF9UUkFOU0xBVElPTl9NT0RFKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX1NVQk1JVF9UUkFOU0xBVElPTl9NT0RFID0gIXRoaXMuc2V0dGluZ3MuSTE4Tl9TVUJNSVRfVFJBTlNMQVRJT05fTU9ERTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBCYXNlU2V0dGluZyBmcm9tIFwiLi9iYXNlLXNldHRpbmdcIjtcclxuXHJcbi8vIFx1NUZGRFx1NzU2NVx1NjNEMlx1NEVGNlx1OEJCRVx1N0Y2RSBcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSTE4bklnbm9yZSBleHRlbmRzIEJhc2VTZXR0aW5nIHtcclxuICAgIG1haW4oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaTE4bklnbm9yZSA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIGkxOG5JZ25vcmUuc2V0TmFtZShcIlx1NUZGRFx1NzU2NVx1NjNEMlx1NEVGNlwiKTtcclxuICAgICAgICBpMThuSWdub3JlLnNldERlc2MoXCJcdTVGRkRcdTc1NjVcdTUzRUZcdTgwRkRcdTgxRUFcdTVFMjZcdTZDNDlcdTUzMTZcdTc2ODRcdTYzRDJcdTRFRjYoXHU5NzAwXHU4OTgxXHU0RTkxXHU3QUVGXHU3RkZCXHU4QkQxQVBJXHU2NTJGXHU2MzAxKVwiKTtcclxuICAgICAgICBpMThuSWdub3JlLmFkZFRvZ2dsZShjYiA9PiBjYlxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX0lHTk9SRSlcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9JR05PUkUgPSAhdGhpcy5zZXR0aW5ncy5JMThOX0lHTk9SRTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmkxOG4ubWFuaWZlc3QuaWQ7XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMuYXBwLnNldHRpbmc7XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC5wbHVnaW5zLmRpc2FibGVQbHVnaW4oaWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAucGx1Z2lucy5lbmFibGVQbHVnaW4oaWQpO1xyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwgImltcG9ydCB7IE5vdGljZSwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiXHJcbmltcG9ydCBCYXNlU2V0dGluZyBmcm9tIFwiLi9iYXNlLXNldHRpbmdcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSTE4blJFIGV4dGVuZHMgQmFzZVNldHRpbmcge1xyXG4gICAgbWFpbigpOiB2b2lkIHtcclxuICAgICAgICAvLyBSRSBcdTZBMjFcdTVGMEZcclxuICAgICAgICBjb25zdCBpMThuUkVNb2RlID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCk7XHJcbiAgICAgICAgaTE4blJFTW9kZS5zZXROYW1lKCdcdTZBMjFcdTVGMEYnKTtcclxuICAgICAgICBpMThuUkVNb2RlLnNldERlc2MoJ1x1NUY1M1x1NTI0RFx1NkI2M1x1NTcyOFx1NEY3Rlx1NzUyOFx1NzY4NFx1NTMzOVx1OTE0RFx1NkEyMVx1NUYwRicpO1xyXG4gICAgICAgIGkxOG5SRU1vZGUuYWRkVGV4dChjYiA9PiBjYlxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREUpXHJcbiAgICAgICAgICAgIC5zZXREaXNhYmxlZCh0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaTE4blJFTW9kZS5hZGRCdXR0b24oY2IgPT4gY2JcclxuICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVfRURJVCA/ICdcdTk2OTBcdTg1Q0YnIDogJ1x1N0YxNlx1OEY5MScpXHJcbiAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9NT0RFX0VESVQgPSAhdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVfRURJVDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTdGMTZcdThGOTFcdTZBMjFcdTVGMEZcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVfRURJVCkge1xyXG4gICAgICAgICAgICAvLyBSRSBcdTY4MDdcdTVGRDdcclxuICAgICAgICAgICAgY29uc3QgaTE4blJFRmxhZ3MgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICAgICAgaTE4blJFRmxhZ3Muc2V0TmFtZSgnXHU2ODA3XHU1RkQ3Jyk7XHJcbiAgICAgICAgICAgIGkxOG5SRUZsYWdzLnNldERlc2MoJ1x1NkI2M1x1NTIxOVx1ODg2OFx1OEZCRVx1NUYwRlx1NzY4NGZsYWdzJyk7XHJcbiAgICAgICAgICAgIGkxOG5SRUZsYWdzLmFkZFRleHQoY2IgPT4gY2JcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLkkxOE5fUkVfRkxBR1MpXHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ2ZsYWdzJylcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fUkVfRkxBR1MgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAvLyBSRSBcdTk1N0ZcdTVFQTZcclxuICAgICAgICAgICAgY29uc3QgaTE4blJFTGVuZ3RoID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCk7XHJcbiAgICAgICAgICAgIGkxOG5SRUxlbmd0aC5zZXROYW1lKCdcdTk1N0ZcdTVFQTYnKTtcclxuICAgICAgICAgICAgaTE4blJFTGVuZ3RoLnNldERlc2MoJ3JlXHU1M0VGXHU0RUU1XHU1MzM5XHU5MTREXHU1MjMwXHU3Njg0XHU2NzAwXHU1OTI3XHU5NTdGXHU1RUE2Jyk7XHJcbiAgICAgICAgICAgIGkxOG5SRUxlbmd0aC5hZGRTbGlkZXIoY2IgPT4gY2JcclxuICAgICAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXHJcbiAgICAgICAgICAgICAgICAuc2V0TGltaXRzKDAsIDEwMDAsIDI1KVxyXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9MRU5HVEgpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX1JFX0xFTkdUSCA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAvLyBcdTZBMjFcdTVGMEZcdTdGMTZcdThGOTFcclxuICAgICAgICAgICAgbGV0IG1vZGVTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgY29uc3QgaTE4blJFTW9kZXMgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICAgICAgaTE4blJFTW9kZXMuc2V0TmFtZSgnXHU2QTIxXHU1RjBGXHU3RjE2XHU4RjkxJyk7XHJcbiAgICAgICAgICAgIGkxOG5SRU1vZGVzLnNldERlc2MoJ1x1NjVCMFx1NTg5RVx1NTQ4Q1x1NTIyMFx1OTY2NFx1NkI2M1x1NTIxOVx1ODg2OFx1OEZCRVx1NUYwRlx1NTMzOVx1OTE0RFx1NkEyMVx1NUYwRicpO1xyXG4gICAgICAgICAgICBpMThuUkVNb2Rlcy5hZGRUZXh0KGNiID0+IGNiXHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ1x1NkEyMVx1NUYwRicpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZVN0cmluZyA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpMThuUkVNb2Rlcy5hZGRCdXR0b24oY2IgPT4gY2JcclxuICAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KCdcdTZERkJcdTUyQTAnKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlU3RyaW5nICE9ICcnICYmICF0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERVMuaW5jbHVkZXMobW9kZVN0cmluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVTLnB1c2gobW9kZVN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5JMThOX1JFX0RBVEFTLmhhc093blByb3BlcnR5KG1vZGVTdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fUkVfREFUQVNbbW9kZVN0cmluZ10gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShgUkVcdTZBMjFcdTVGMEZcdTU0MERcdTc5RjBcdTkxQ0RcdTU5MEQgXHU2NUUwXHU2Q0Q1XHU2REZCXHU1MkEwYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaTE4blJFTW9kZXMuYWRkQnV0dG9uKGNiID0+IGNiXHJcbiAgICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERV9ESVNQTEFZID8gJ1x1OTY5MFx1ODVDRicgOiAnXHU2N0U1XHU3NzBCJylcclxuICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERV9ESVNQTEFZID0gIXRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9NT0RFX0RJU1BMQVk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVfRElTUExBWSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERVMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpMThuUkVNb2RlSXRlbSA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGkxOG5SRU1vZGVJdGVtLnNldE5hbWUodGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVTW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREUgIT0gdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVTW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5SRU1vZGVJdGVtLmFkZEJ1dHRvbihjYiA9PiBjYlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oJ2NoZWNrJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERSA9IHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9NT0RFU1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nVGFiLmRpc3BsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaTE4blJFTW9kZUl0ZW0uYWRkQnV0dG9uKGNiID0+IGNiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKCd0cmFzaCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERVMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNldHRpbmdzLkkxOE5fUkVfREFUQVNbdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVTW2ldXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhID0gdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVTW2ldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYiA9IHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9NT0RFXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYSA9PSBiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVTW2ldID09IHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9NT0RFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9NT0RFID0gdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVTWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9NT0RFUy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShgXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYFx1NTNFQVx1NTI2OVx1NEUwQlx1NEUwMFx1NEUyQVx1NEU4NiBcdTY1RTBcdTZDRDVcdTUyMjBcdTk2NjRgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5kaXNwbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gXHU2NTcwXHU2MzZFXHU3RjE2XHU4RjkxXHJcbiAgICAgICAgICAgIGxldCByZWdleHBTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgY29uc3QgaTE4blJFRGF0YXMgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICAgICAgaTE4blJFRGF0YXMuc2V0TmFtZSgnXHU2NTcwXHU2MzZFXHU3RjE2XHU4RjkxJyk7XHJcbiAgICAgICAgICAgIGkxOG5SRURhdGFzLnNldERlc2MoJ1x1NjVCMFx1NTg5RVx1NTQ4Q1x1NTIyMFx1OTY2NFx1NkI2M1x1NTIxOVx1ODg2OFx1OEZCRVx1NUYwRlx1NkEyMVx1NUYwRlx1NjU3MFx1NjM2RScpO1xyXG4gICAgICAgICAgICBpMThuUkVEYXRhcy5hZGRUZXh0KGNiID0+IGNiXHJcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ1JlZ0V4cCcpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhwU3RyaW5nID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGkxOG5SRURhdGFzLmFkZEJ1dHRvbihjYiA9PiBjYlxyXG4gICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1x1NkRGQlx1NTJBMCcpXHJcbiAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ2V4cFN0cmluZyAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLkkxOE5fUkVfREFUQVNbdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVdLnB1c2gocmVnZXhwU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdUYWIuZGlzcGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGkxOG5SRURhdGFzLmFkZEJ1dHRvbihjYiA9PiBjYlxyXG4gICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy5zZXR0aW5ncy5JMThOX1JFX0RBVEFTX0RJU1BMQVkgPyAnXHU5NjkwXHU4NUNGJyA6ICdcdTY3RTVcdTc3MEInKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9EQVRBU19ESVNQTEFZID0gIXRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9EQVRBU19ESVNQTEFZO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdUYWIuZGlzcGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9EQVRBU19ESVNQTEFZKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9EQVRBU1t0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpMThuUkVEYXRhc0l0ZW0gPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKTtcclxuICAgICAgICAgICAgICAgICAgICBpMThuUkVEYXRhc0l0ZW0uc2V0TmFtZSh0aGlzLnNldHRpbmdzLkkxOE5fUkVfREFUQVNbdGhpcy5zZXR0aW5ncy5JMThOX1JFX01PREVdW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBpMThuUkVEYXRhc0l0ZW0uYWRkQnV0dG9uKGNiID0+IGNiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKCd0cmFzaCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9EQVRBU1t0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERV0uc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nVGFiLmRpc3BsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0gIiwgImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5cclxuaW1wb3J0IHsgQXBwLCBCdXR0b25Db21wb25lbnQsIEV4dHJhQnV0dG9uQ29tcG9uZW50LCBNb2RhbCwgUGx1Z2luTWFuaWZlc3QsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCBJMThOIGZyb20gJ21haW4nO1xyXG5pbXBvcnQgeyBJMThuU2V0dGluZ3MgfSBmcm9tICcuLi9zZXR0aW5ncy9kYXRhJztcclxuXHJcbmltcG9ydCB7IE1hbmlmZXN0LCBUcmFuc2xhdGlvbiB9IGZyb20gJ3NyYy9kYXRhL3R5cGVzJztcclxuaW1wb3J0IHsgQVBJX1RZUEVTLCBJMThOX1NPUlQsIEkxOE5fVFlQRSB9IGZyb20gJ3NyYy9kYXRhL2RhdGEnO1xyXG5pbXBvcnQgeyBQTm90aWNlLCBOb3RpY2VFcnJvciwgU3RhdGUsIGdlbmVyYXRlVHJhbnNsYXRpb24sIE5vdGljZUluZm8sIE5vdGljZU9wZXJhdGlvblJlc3VsdCB9IGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgR2l0SXNzdWVNb2RhbCB9IGZyb20gJy4vZ2l0LWlzc3VlLW1vZGFsJztcclxuaW1wb3J0IHsgV2l6YXJkTW9kYWwgfSBmcm9tICcuL3dpemFyZC1tb2RhbCc7XHJcbmltcG9ydCB7IHQgfSBmcm9tICcuLi9sYW5nL2lueGRleCc7XHJcbmltcG9ydCBVcmwgZnJvbSAnc3JjL3VybCc7XHJcblxyXG4vLyBwcm9tcHRcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vICAgICAgICAgIFx1NEZBN1x1OEZCOVx1NjgwRiBcdTVCRjlcdThCRERcdTY4NDYgXHU3RkZCXHU4QkQxXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5leHBvcnQgY2xhc3MgSTE4Tk1vZGFsIGV4dGVuZHMgTW9kYWwge1xyXG4gICAgaTE4bjogSTE4TjtcclxuICAgIHNldHRpbmdzOiBJMThuU2V0dGluZ3M7XHJcbiAgICBiYXNlUGF0aDogc3RyaW5nO1xyXG4gICAgLy8gW1x1NjcyQ1x1NTczMF1bXHU1M0Q4XHU5MUNGXSBcdTUxNjhcdTkwRThcdTYzRDJcdTRFRjZcdTUyMTdcdTg4NjhcclxuICAgIHBsdWdpbnM6IFBsdWdpbk1hbmlmZXN0W10gPSBbXTtcclxuICAgIC8vIFtcdTY3MkNcdTU3MzBdW1x1NTNEOFx1OTFDRl0gXHU1QzU1XHU3OTNBXHU2M0QyXHU0RUY2XHU1MjE3XHU4ODY4XHJcbiAgICBzaG93UGx1Z2luczogUGx1Z2luTWFuaWZlc3RbXSA9IFtdO1xyXG4gICAgLy8gW1x1NjcyQ1x1NTczMF1bXHU1M0Q4XHU5MUNGXSBcdTVGMDBcdTU0MkZcdTYzRDJcdTRFRjZcdTUyMTdcdTg4NjhcclxuICAgIGVuYWJsZWRQbHVnaW5zOiBTZXQ8c3RyaW5nPjtcclxuICAgIC8vIFtcdTY3MkNcdTU3MzBdW1x1NTNEOFx1OTFDRl0gXHU2M0QyXHU0RUY2XHU4QkJFXHU3RjZFXHJcbiAgICBzZXR0aW5nUGx1Z2luczogeyBvcGVuOiAoKSA9PiB2b2lkOyBvcGVuVGFiQnlJZDogKGFyZzA6IHN0cmluZykgPT4gdm9pZDsgfTtcclxuXHJcbiAgICByZWdleHBzOiBzdHJpbmdbXTtcclxuICAgIGRldmVsb3Blck1vZGUgPSBmYWxzZTtcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgIFx1Njc4NFx1OTAyMFx1NTFGRFx1NjU3MFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaTE4bjogSTE4Tikge1xyXG4gICAgICAgIHN1cGVyKGFwcCk7XHJcbiAgICAgICAgdGhpcy5pMThuID0gaTE4bjtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5iYXNlUGF0aCA9IHBhdGgubm9ybWFsaXplKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IGkxOG4uc2V0dGluZ3M7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuc2V0dGluZ1BsdWdpbnMgPSB0aGlzLmFwcC5zZXR0aW5nO1xyXG4gICAgICAgIHRoaXMucmVnZXhwcyA9IHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9EQVRBU1t0aGlzLnNldHRpbmdzLkkxOE5fUkVfTU9ERV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIFx1NUM1NVx1NzkzQVx1NjRDRFx1NEY1Q1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBwdWJsaWMgYXN5bmMgc2hvd0hlYWQoKSB7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3QgbW9kYWxFbDogSFRNTEVsZW1lbnQgPSB0aGlzLmNvbnRlbnRFbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIG1vZGFsRWwuYWRkQ2xhc3MoJ2kxOG5fbW9kYWwnKTtcclxuICAgICAgICBtb2RhbEVsLnJlbW92ZUNoaWxkKG1vZGFsRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtY2xvc2UtYnV0dG9uJylbMF0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlRWwuYWRkQ2xhc3MoJ2kxOG5fbW9kYWxfdGl0bGVfYm94Jyk7XHJcbiAgICAgICAgdGhpcy5jb250ZW50RWwuYWRkQ2xhc3MoJ2kxOG5fbW9kYWxfaXRlbV9ib3gnKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVzdCA9IG5ldyBTZXR0aW5nKHRoaXMudGl0bGVFbCk7XHJcbiAgICAgICAgdGVzdC5zZXRDbGFzcygnaTE4bl9tb2RhbF90aXRsZV9ib3hfMScpO1xyXG4gICAgICAgIHRlc3Quc2V0TmFtZSgnXHU5MDQ3XHU1MjMwXHU5NkJFXHU5ODk4XHVGRjFGXHU5MDFGXHU1MkEwUVx1N0ZBNFx1NTRBOFx1OEJFMlx1RkYwMScpO1xyXG5cclxuICAgICAgICBjb25zdCBxcUJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQodGVzdC5jb250cm9sRWwpO1xyXG4gICAgICAgIHFxQnV0dG9uLnNldEljb24oJ2kxOG5fcXEnKTtcclxuICAgICAgICBxcUJ1dHRvbi5zZXRUb29sdGlwKCdcdTRFMDBcdTk1MkVcdTc2RjRcdThGQkVcdUZGMENcdTUyQTBcdTUxNjVRXHU3RkE0XHU1MTcxXHU0RUFCXHU3Q0JFXHU1RjY5XHVGRjAxJyk7XHJcbiAgICAgICAgcXFCdXR0b24ub25DbGljaygoKSA9PiB7IHdpbmRvdy5vcGVuKFVybC5RUV9HUk9VUCkgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNldHRpbmdUYWJCdXR0b24gPSBuZXcgQnV0dG9uQ29tcG9uZW50KHRlc3QuY29udHJvbEVsKTtcclxuICAgICAgICBzZXR0aW5nVGFiQnV0dG9uLnNldEljb24oJ3NldHRpbmdzJyk7XHJcbiAgICAgICAgc2V0dGluZ1RhYkJ1dHRvbi5zZXRUb29sdGlwKCdcdTYyNTNcdTVGMDBcdTYzRDJcdTRFRjZcdThCQkVcdTdGNkUnKTtcclxuICAgICAgICBzZXR0aW5nVGFiQnV0dG9uLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdQbHVnaW5zLm9wZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nUGx1Z2lucy5vcGVuVGFiQnlJZCh0aGlzLmkxOG4ubWFuaWZlc3QuaWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhlbHBCdXR0b24gPSBuZXcgQnV0dG9uQ29tcG9uZW50KHRlc3QuY29udHJvbEVsKTtcclxuICAgICAgICBoZWxwQnV0dG9uLnNldEljb24oJ2NpcmNsZS1oZWxwJyk7XHJcbiAgICAgICAgaGVscEJ1dHRvbi5zZXRUb29sdGlwKCdcdTVFMkVcdTUyQTknKTtcclxuICAgICAgICBoZWxwQnV0dG9uLm9uQ2xpY2soKCkgPT4geyBuZXcgV2l6YXJkTW9kYWwodGhpcy5hcHAsIHRoaXMuaTE4bikub3BlbigpIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzZWFyY2ggPSBuZXcgU2V0dGluZyh0aGlzLnRpdGxlRWwpO1xyXG4gICAgICAgIHNlYXJjaC5zZXRDbGFzcygnaTE4bl9tb2RhbF90aXRsZV9ib3hfMicpO1xyXG4gICAgICAgIHNlYXJjaC5zZXROYW1lKCdcdTY0MUNcdTdEMjInKTtcclxuICAgICAgICBzZWFyY2guYWRkRHJvcGRvd24oY2IgPT4gY2JcclxuICAgICAgICAgICAgLmFkZE9wdGlvbnMoSTE4Tl9TT1JUKVxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX1NPUlQpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9TT1JUID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFNob3dEYXRhKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzZWFyY2guYWRkRHJvcGRvd24oY2IgPT4gY2JcclxuICAgICAgICAgICAgLmFkZE9wdGlvbnMoSTE4Tl9UWVBFKVxyXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5JMThOX1RZUEUpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9UWVBFID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFNob3dEYXRhKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzZWFyY2guYWRkU2VhcmNoKGNiID0+IGNiXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLkkxOE5fU0VBUkNIX1RFWFQpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuSTE4Tl9TRUFSQ0hfVEVYVCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxvYWRTaG93RGF0YSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRldmVsb3Blck1vZGUpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsb2FkID0gbmV3IEJ1dHRvbkNvbXBvbmVudCh0ZXN0LmNvbnRyb2xFbCk7XHJcbiAgICAgICAgICAgIHJlbG9hZC5zZXRJY29uKCdyZWZyZXNoLWNjdycpO1xyXG4gICAgICAgICAgICByZWxvYWQuc2V0VG9vbHRpcCgnXHU1MjM3XHU2NUIwXHU2M0QyXHU0RUY2Jyk7XHJcbiAgICAgICAgICAgIHJlbG9hZC5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVsb2FkUGx1Z2luKHRoaXMuaTE4bi5tYW5pZmVzdC5pZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgXHU1QzU1XHU3OTNBXHU2NTcwXHU2MzZFXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIHB1YmxpYyBhc3luYyBzaG93RGF0YSgpIHtcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAvLyAgICAgICAgICAgIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLnBsdWdpbnMgPSBPYmplY3QudmFsdWVzKHRoaXMuYXBwLnBsdWdpbnMubWFuaWZlc3RzKTtcclxuICAgICAgICB0aGlzLnBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pZCAhPT0gdGhpcy5pMThuLm1hbmlmZXN0LmlkKTtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5lbmFibGVkUGx1Z2lucyA9IHRoaXMuYXBwLnBsdWdpbnMuZW5hYmxlZFBsdWdpbnM7XHJcbiAgICAgICAgLy8gXHU2NDFDXHU3RDIyXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9TRUFSQ0hfVEVYVCA9PSBcIlwiKSB7IHRoaXMuc2hvd1BsdWdpbnMgPSB0aGlzLnBsdWdpbnMgfVxyXG4gICAgICAgIGVsc2UgeyB0aGlzLnNob3dQbHVnaW5zID0gdGhpcy5wbHVnaW5zLmZpbHRlcihpdGVtID0+IGl0ZW0ubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5zZXR0aW5ncy5JMThOX1NFQVJDSF9URVhULnRvTG93ZXJDYXNlKCkpICE9IC0xKTsgfVxyXG4gICAgICAgIC8vIFx1NTIwNlx1N0M3QlxyXG4gICAgICAgIGNvbnN0IGlkc1RvUmVtb3ZlOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5zZXR0aW5ncy5JMThOX1RZUEUpIHtcclxuICAgICAgICAgICAgY2FzZSAnMCc6ICAvLyBcdTUxNjhcdTkwRThcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJzEnOiAgLy8gXHU2NzJBXHU2M0QwXHU1M0Q2XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLnNob3dQbHVnaW5zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsdWdpbkRpciA9IHBhdGguam9pbih0aGlzLmJhc2VQYXRoLCBwbHVnaW4uZGlyKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBzdGF0ZURvYyA9IHBhdGguam9pbihwbHVnaW5EaXIsICdsYW5nJywgJ3N0YXRlLmpzb24nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZnMucGF0aEV4aXN0c1N5bmMocGF0aC5qb2luKHBsdWdpbkRpciwgJ2xhbmcnLCBgJHt0aGlzLnNldHRpbmdzLkkxOE5fTEFOR1VBR0V9Lmpzb25gKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRzVG9SZW1vdmUucHVzaChwbHVnaW4uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BsdWdpbnMgPSB0aGlzLnNob3dQbHVnaW5zLmZpbHRlcihwbHVnaW4gPT4gIWlkc1RvUmVtb3ZlLmluY2x1ZGVzKHBsdWdpbi5pZCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnMic6ICAvLyBcdTY3MkFcdTdGRkJcdThCRDFcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuc2hvd1BsdWdpbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGx1Z2luRGlyID0gcGF0aC5qb2luKHRoaXMuYmFzZVBhdGgsIHBsdWdpbi5kaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlRG9jID0gcGF0aC5qb2luKHBsdWdpbkRpciwgJ2xhbmcnLCAnc3RhdGUuanNvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzU3RhdGVEb2MgPSBmcy5wYXRoRXhpc3RzU3luYyhzdGF0ZURvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZzLnBhdGhFeGlzdHNTeW5jKHBhdGguam9pbihwbHVnaW5EaXIsICdsYW5nJykpICYmIGlzU3RhdGVEb2MpIHsgaWYgKGZzLnJlYWRKc29uU3luYyhzdGF0ZURvYykuc3RhdGUgIT0gZmFsc2UpIHsgaWRzVG9SZW1vdmUucHVzaChwbHVnaW4uaWQpIH0gfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgeyBpZHNUb1JlbW92ZS5wdXNoKHBsdWdpbi5pZCkgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UGx1Z2lucyA9IHRoaXMuc2hvd1BsdWdpbnMuZmlsdGVyKHBsdWdpbiA9PiAhaWRzVG9SZW1vdmUuaW5jbHVkZXMocGx1Z2luLmlkKSk7XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICczJzogIC8vIFx1NURGMlx1N0ZGQlx1OEJEMVxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5zaG93UGx1Z2lucykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLmpvaW4odGhpcy5iYXNlUGF0aCwgcGx1Z2luLmRpcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdGVEb2MgPSBwYXRoLmpvaW4ocGx1Z2luRGlyLCAnbGFuZycsICdzdGF0ZS5qc29uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNTdGF0ZURvYyA9IGZzLnBhdGhFeGlzdHNTeW5jKHN0YXRlRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZnMucGF0aEV4aXN0c1N5bmMocGF0aC5qb2luKHBsdWdpbkRpciwgJ2xhbmcnKSkgJiYgaXNTdGF0ZURvYykgeyBpZiAoZnMucmVhZEpzb25TeW5jKHN0YXRlRG9jKS5zdGF0ZSAhPSB0cnVlKSB7IGlkc1RvUmVtb3ZlLnB1c2gocGx1Z2luLmlkKSB9IH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHsgaWRzVG9SZW1vdmUucHVzaChwbHVnaW4uaWQpIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BsdWdpbnMgPSB0aGlzLnNob3dQbHVnaW5zLmZpbHRlcihwbHVnaW4gPT4gIWlkc1RvUmVtb3ZlLmluY2x1ZGVzKHBsdWdpbi5pZCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gXHU2MzkyXHU1RThGXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLkkxOE5fU09SVCkge1xyXG4gICAgICAgICAgICBjYXNlICcwJzogIC8vIFx1NkI2M1x1NUU4RlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UGx1Z2lucy5zb3J0KChpdGVtMSwgaXRlbTIpID0+IHsgcmV0dXJuIGl0ZW0xLm5hbWUubG9jYWxlQ29tcGFyZShpdGVtMi5uYW1lKSB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJzEnOiAgLy8gXHU1MDEyXHU1RThGXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dQbHVnaW5zLnNvcnQoKGl0ZW0xLCBpdGVtMikgPT4geyByZXR1cm4gaXRlbTIubmFtZS5sb2NhbGVDb21wYXJlKGl0ZW0xLm5hbWUpIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIC8vICAgICAgICAgICBcdTRFM0JcdTkwM0JcdThGOTFcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLnNob3dQbHVnaW5zKSB7XHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBcdThERUZcdTVGODRcdTUzQ0FcdTUxNzZcdTcyQjZcdTYwMDFcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vICNyZWdpb25cclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLmpvaW4odGhpcy5iYXNlUGF0aCwgcGx1Z2luLmRpcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhbmdEaXIgPSBwYXRoLmpvaW4ocGx1Z2luRGlyLCAnbGFuZycpO1xyXG4gICAgICAgICAgICBjb25zdCBsYW5nRG9jID0gcGF0aC5qb2luKHBsdWdpbkRpciwgJ2xhbmcnLCBgJHt0aGlzLnNldHRpbmdzLkkxOE5fTEFOR1VBR0V9Lmpzb25gKTtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGVEb2MgPSBwYXRoLmpvaW4ocGx1Z2luRGlyLCAnbGFuZycsICdzdGF0ZS5qc29uJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzTGFuZ0RpciA9IGZzLnBhdGhFeGlzdHNTeW5jKGxhbmdEaXIpO1xyXG4gICAgICAgICAgICBjb25zdCBpc0xhbmdEb2MgPSBmcy5wYXRoRXhpc3RzU3luYyhsYW5nRG9jKTtcclxuICAgICAgICAgICAgbGV0IGlzU3RhdGVEb2MgPSBmcy5wYXRoRXhpc3RzU3luYyhzdGF0ZURvYyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0RG9jID0gcGF0aC5qb2luKHBsdWdpbkRpciwgJ21hbmlmZXN0Lmpzb24nKTtcclxuICAgICAgICAgICAgY29uc3QgbWFpbkRvYyA9IHBhdGguam9pbihwbHVnaW5EaXIsICdtYWluLmpzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGR1cGxpY2F0ZURvYyA9IHBhdGguam9pbihwbHVnaW5EaXIsICdkdXBsaWNhdGUuanMnKTtcclxuICAgICAgICAgICAgLy8gXHU1MjFCXHU1RUZBXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHU1QkY5XHU4QzYxXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlT2JqID0gbmV3IFN0YXRlKHN0YXRlRG9jKTtcclxuICAgICAgICAgICAgLy8gXHU1RjUzXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHU0RTBEXHU1QjU4XHU1NzI4XHU2NUY2XHU1MjFCXHU1RUZBXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgIGlmIChpc0xhbmdEaXIgJiYgIWlzU3RhdGVEb2MpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVPYmouaW5zZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNTdGF0ZURvYyA9IGZzLnBhdGhFeGlzdHNTeW5jKHN0YXRlRG9jKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWNlRXJyb3IoJ1x1OTUxOVx1OEJFRicsIGBlcnJvcmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBcdTY3MkNcdTU3MzBcdThCRDFcdTY1ODdcdTRFQ0JcdTdFQ0RcclxuICAgICAgICAgICAgbGV0IGxvY2FsVHJhbnNsYXRpb25Kc29uOiBUcmFuc2xhdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgLy8gXHU0RTkxXHU3QUVGXHU4QkQxXHU2NTg3XHU0RUNCXHU3RUNEXHJcbiAgICAgICAgICAgIGxldCBjbG91ZFRyYW5zbGF0aW9uTWFuaWZlc3RKc29uOiBNYW5pZmVzdCB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgLy8gXHU1MjI0XHU2NUFEIFx1NjcyQ1x1NTczMFx1NjNEMlx1NEVGNlx1NTQ4Q1x1NEU5MVx1N0FFRlx1NjNEMlx1NEVGNiBcdTcyNDhcdTY3MkNcdTY2MkZcdTU0MjZcdTc2RjhcdTU0MENcdTY4MDdcdThCQjBcclxuICAgICAgICAgICAgbGV0IGlzUGx1Z2luc1ZlcnNpb25TYW1lTWFyazogYm9vbGVhbjtcclxuICAgICAgICAgICAgLy8gXHU1MjI0XHU2NUFEIFx1NjcyQ1x1NTczMFx1OEJEMVx1NjU4N1x1NTQ4Q1x1NEU5MVx1N0FFRlx1OEJEMVx1NjU4NyBcdTcyNDhcdTY3MkNcdTY2MkZcdTU0MjZcdTc2RjhcdTU0MENcdTY4MDdcdThCQjBcclxuICAgICAgICAgICAgbGV0IGlzVHJhbnNsYXRpb25WZXJzaW9uU2FtZU1hcms6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgLy8gXHU0RTkxXHU3QUVGXHU2NzAwXHU2NUIwXHU3MjQ4XHU2M0QyXHU0RUY2XHU3MjQ4XHU2NzJDXHU1M0Y3XHJcbiAgICAgICAgICAgIGxldCBsYXRlc3RDbG91ZFZlcnNpb246IHN0cmluZztcclxuICAgICAgICAgICAgLy8gXHU4QkQxXHU2NTg3XHU2ODNDXHU1RjBGXHU2NjJGXHU1NDI2XHU2QjYzXHU1RTM4XHU2ODA3XHU4QkIwXHJcbiAgICAgICAgICAgIGxldCB0cmFuc2xhdGlvbkZvcm1hdE1hcmsgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaTE4bi5kaXJlY3RvcnlNYXJrKSB7IGNsb3VkVHJhbnNsYXRpb25NYW5pZmVzdEpzb24gPSB0aGlzLmkxOG4uZGlyZWN0b3J5LmZpbmQoKG1hbmlmZXN0OiBNYW5pZmVzdCkgPT4gbWFuaWZlc3QuaWQgPT09IHBsdWdpbi5pZCkgfVxyXG4gICAgICAgICAgICBpZiAoY2xvdWRUcmFuc2xhdGlvbk1hbmlmZXN0SnNvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIFx1NjcyQ1x1NTczMFx1OEJEMVx1NjU4N1x1NTQ4Q1x1NEU5MVx1N0FFRlx1OEJEMVx1NjU4NyBcdTYzRDJcdTRFRjZcdTcyNDhcdTY3MkNcdTY2MkZcdTU0MjZcdTc2RjhcdTU0MENcdTY4MDdcdThCQjBcclxuICAgICAgICAgICAgICAgIGlzUGx1Z2luc1ZlcnNpb25TYW1lTWFyayA9IGNsb3VkVHJhbnNsYXRpb25NYW5pZmVzdEpzb24udHJhbnNsYXRpb25zLmZpbmQodHJhbnNsYXRpb24gPT4gdHJhbnNsYXRpb24ucGx1Z2luVmVyc2lvbiA9PT0gcGx1Z2luLnZlcnNpb24pICE9PSB1bmRlZmluZWQgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvLyBcdTY3MDBcdTY1QjBcdTRFOTFcdTdBRUZcdTcyNDhcdTY3MkNcclxuICAgICAgICAgICAgICAgIGxhdGVzdENsb3VkVmVyc2lvbiA9IGlzUGx1Z2luc1ZlcnNpb25TYW1lTWFyayA/IHBsdWdpbi52ZXJzaW9uIDogY2xvdWRUcmFuc2xhdGlvbk1hbmlmZXN0SnNvbi50cmFuc2xhdGlvbnMuc2xpY2UoLTEpWzBdLnBsdWdpblZlcnNpb247XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gY2xvdWRUcmFuc2xhdGlvbk1hbmlmZXN0SnNvbi50cmFuc2xhdGlvbnMuZmluZCh0cmFuc2xhdGlvbiA9PiB0cmFuc2xhdGlvbi5wbHVnaW5WZXJzaW9uID09PSBsYXRlc3RDbG91ZFZlcnNpb24pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGVtcCk7XHJcbiAgICAgICAgICAgICAgICAvLyBcdTY3MkNcdTU3MzBcdThCRDFcdTY1ODdcdTY4MDdcdThCQjAoXHU1MjI0XHU2NUFEXHU2NzJDXHU1NzMwXHU4QkQxXHU2NTg3XHU1NDhDXHU3RjUxXHU3RURDXHU0RTJEXHU2NzAwXHU2NUIwXHU4QkQxXHU2NTg3XHU2NjJGXHU1NDI2XHU1MzM5XHU5MTREKVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzTGFuZ0RvYyAmJiB0ZW1wICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVHJhbnNsYXRpb25WZXJzaW9uU2FtZU1hcmsgPSBmcy5yZWFkSnNvblN5bmMobGFuZ0RvYykubWFuaWZlc3QudmVyc2lvbiA9PSB0ZW1wLnRyYW5zbGF0aW9uVmVyc2lvbiA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gXHU2OEMwXHU2N0U1XHU4QkQxXHU2NTg3XHU2ODNDXHU1RjBGXHJcbiAgICAgICAgICAgIGlmIChpc0xhbmdEb2MpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxUcmFuc2xhdGlvbkpzb24gPSBmcy5yZWFkSnNvblN5bmMobGFuZ0RvYyk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uRm9ybWF0TWFyayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIE5vdGljZUVycm9yKGAke3BsdWdpbi5uYW1lfWAsICdcdThCRDFcdTY1ODdcdTY4M0NcdTVGMEZcdTk1MTlcdThCRUYnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gXHU2M0QyXHU0RUY2XHU2NkY0XHU2NUIwKFx1NjZGNFx1NjVCMFx1OEZEOFx1NTM5Rlx1NjNEMlx1NEVGNlx1NzJCNlx1NjAwMSlcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgaWYgKGlzU3RhdGVEb2MgJiYgc3RhdGVPYmouc3RhdGUoKSAmJiBwbHVnaW4udmVyc2lvbiAhPSBzdGF0ZU9iai5wbHVnaW5WZXJzaW9uKCkpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnMucmVtb3ZlU3luYyhkdXBsaWNhdGVEb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlT2JqLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIFBOb3RpY2UoJ1x1OTUxOVx1OEJFRicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAjZW5kcmVnaW9uXHJcblxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gICAgICBcdTYzRDJcdTRFRjZcdTU3RkFcdTc4NDBcdTUyOUZcdTgwRkQoXHU0RUNCXHU3RUNEIFx1NjI1M1x1NUYwMFx1NzZFRVx1NUY1NSBcdTUyMjBcdTk2NjRcdTc2RUVcdTVGNTUgXHU3RjE2XHU4RjkxXHU4QkQxXHU2NTg3IFx1NjNEMFx1NEVBNFx1OEJEMVx1NjU4NylcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vICNyZWdpb25cclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gXHU2M0QyXHU0RUY2XHU0RUNCXHU3RUNEXHU1OTM0XHU5MEU4XHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gbmV3IFNldHRpbmcodGhpcy5jb250ZW50RWwpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDbGFzcygnaTE4bl9tb2RhbF9pdGVtJyk7XHJcbiAgICAgICAgICAgIGJsb2NrLm5hbWVFbC5hZGRDbGFzcygnaTE4bl9tb2RhbF9pdGVtX3RpdGxlJyk7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZU1hcms7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNMYW5nRG9jICYmIHN0YXRlT2JqLnN0YXRlKCkgPT0gdHJ1ZSAmJiB0cmFuc2xhdGlvbkZvcm1hdE1hcmspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uSnNvbjogVHJhbnNsYXRpb24gPSBmcy5yZWFkSlNPTlN5bmMobGFuZ0RvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNsYXRpb25Kc29uLm1hbmlmZXN0LnBsdWdpblZlcnNpb24gPT09IHBsdWdpbi52ZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVNYXJrID0gW1wic3VjY2Vzc1wiLCBcIlx1NURGMlx1N0ZGQlx1OEJEMVwiXTsgIC8vIFx1NjcyQVx1N0ZGQlx1OEJEMVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZU1hcmsgPSBbXCJ3YXJuaW5nXCIsIFwiXHU1REYyXHU4RkM3XHU2NUY2XCJdOyAvLyBcdTVERjJcdThGQzdcdTY1RjZcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xhbmdEb2MgJiYgc3RhdGVPYmouc3RhdGUoKSA9PSBmYWxzZSAmJiB0cmFuc2xhdGlvbkZvcm1hdE1hcmspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbkpzb246IFRyYW5zbGF0aW9uID0gZnMucmVhZEpTT05TeW5jKGxhbmdEb2MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0aW9uSnNvbi5tYW5pZmVzdC5wbHVnaW5WZXJzaW9uID09PSBwbHVnaW4udmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlTWFyayA9IFtcImVycm9yXCIsIFwiXHU2NzJBXHU3RkZCXHU4QkQxXCJdOyAvLyBcdTVERjJcdTdGRkJcdThCRDFcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVNYXJrID0gW1wid2FybmluZ1wiLCBcIlx1NURGMlx1OEZDN1x1NjVGNlwiXTsgLy8gXHU1REYyXHU4RkM3XHU2NUY2XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZU1hcmsgPSBbXCJlcnJvclwiLCBcIlx1NjVFMFx1OEJEMVx1NjU4N1wiXTsgLy8gXHU2NUUwXHU4QkQxXHU2NTg3XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsb2NrLm5hbWVFbC5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaTE4bl9tb2RhbF9pdGVtX3N0YXRlIGkxOG5fbW9kYWxfaXRlbV9zdGF0ZV8ke3N0YXRlTWFya1swXX1cIj4ke3N0YXRlTWFya1sxXX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaTE4bl9tb2RhbF9pdGVtX3RpdGxlXCI+JHtwbHVnaW4ubmFtZX08L3NwYW4+IFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImkxOG5fbW9kYWxfaXRlbV92ZXJzaW9uXCIgc3R5bGU9XCJjb2xvcjotLXNpbXBsZS1ibHVlLTI7XCI+KCR7cGx1Z2luLnZlcnNpb259KTwvc3Bhbj4gXHJcbiAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vIFx1NjNEMlx1NEVGNlx1NEVDQlx1N0VDRFx1OEJFNlx1NjBDNVxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICBpZiAoaXNMYW5nRG9jKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNsYXRpb25Gb3JtYXRNYXJrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU2NzJDXHU1NzMwXHU1QjU4XHU1NzI4XHU4QkQxXHU2NTg3XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZGVzY0VsLmNyZWF0ZURpdih7IHRleHQ6IGBbXHU2NzJDXHU1NzMwXSAke2xvY2FsVHJhbnNsYXRpb25Kc29uPy5tYW5pZmVzdC5hdXRob3J9ICgke2xvY2FsVHJhbnNsYXRpb25Kc29uPy5tYW5pZmVzdC5wbHVnaW5WZXJzaW9ufSkgYCB9KTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5kZXNjRWwuY3JlYXRlRGl2KHsgdGV4dDogJ1tcdTY3MkNcdTU3MzBdIFx1NkIyMlx1OEZDRVx1NTE3MVx1NEVBQlx1NjBBOFx1NzY4NFx1OEJEMVx1NjU4NycgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1OEJEMVx1NjU4N1x1NjgzQ1x1NUYwRlx1NjcwOVx1OEJFRlxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmRlc2NFbC5jcmVhdGVEaXYoeyB0ZXh0OiAnW1x1OEJEMVx1NjU4N10gXHU4QkQxXHU2NTg3XHU2ODNDXHU1RjBGXHU5NTE5XHU4QkVGJyB9KS5hZGRDbGFzcygnaTE4bl9jb2xvcl9yZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5kZXNjRWwuY3JlYXRlRGl2KHsgdGV4dDogJ1tcdThCRDFcdTY1ODddIFx1OEJGN1x1NEVENFx1N0VDNlx1NjhDMFx1NjdFNVx1OEMwM1x1NjU3NFx1NjIxNlx1NTIyMFx1OTY2NFx1NTQwRVx1OTFDRFx1OEJENScgfSkuYWRkQ2xhc3MoJ2kxOG5fY29sb3JfcmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pMThuLmRpcmVjdG9yeU1hcmsgJiYgIXRoaXMuaTE4bi5pZ25vcmVNYXJrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pMThuLmlnbm9yZU1hcmsgJiYgdGhpcy5pMThuLmlnbm9yZVBsdWdpbnMuaW5jbHVkZXMocGx1Z2luLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmRlc2NFbC5jcmVhdGVEaXYoeyB0ZXh0OiBgW1x1NjNEMlx1NEVGNl0gXHU2QjY0XHU2M0QyXHU0RUY2XHU1M0VGXHU4MEZEXHU4MUVBXHU1RTI2XHU3RkZCXHU4QkQxXHU1MjlGXHU4MEZEYCB9KTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5kZXNjRWwuY3JlYXRlRGl2KHsgdGV4dDogJ1x1MjAwRScgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2xvdWRUcmFuc2xhdGlvbk1hbmlmZXN0SnNvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IGNsb3VkVHJhbnNsYXRpb25NYW5pZmVzdEpzb24udHJhbnNsYXRpb25zLmZpbmQodHJhbnNsYXRpb24gPT4gdHJhbnNsYXRpb24ucGx1Z2luVmVyc2lvbiA9PT0gbGF0ZXN0Q2xvdWRWZXJzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5kZXNjRWwuY3JlYXRlRGl2KHsgdGV4dDogYFtcdTRFOTFcdTdBRUZdICR7dGVtcD8uYXV0aG9yfSAoJHt0ZW1wPy50cmFuc2xhdGlvblZlcnNpb259KWAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZGVzY0VsLmNyZWF0ZURpdih7IHRleHQ6ICdcdTIwMEUnIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5kZXNjRWwuY3JlYXRlRGl2KHsgdGV4dDogYFtcdTRFOTFcdTdBRUZdIFx1NEU5MVx1N0FFRlx1NjVFMFx1NTNFRlx1NEUwQlx1OEY3RFx1OEJEMVx1NjU4N2AgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZGVzY0VsLmNyZWF0ZURpdih7IHRleHQ6ICdbXHU0RTkxXHU3QUVGXSBcdTZCMjJcdThGQ0VcdTUxNzFcdTRFQUJcdTYwQThcdTc2ODRcdThCRDFcdTY1ODcnIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaTE4bi5pZ25vcmVNYXJrICYmIHRoaXMuaTE4bi5pZ25vcmVQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbi5pZCkpIHtcclxuICAgICAgICAgICAgICAgIGJsb2NrLmRlc2NFbC5jcmVhdGVEaXYoeyB0ZXh0OiBgW1x1NjNEMlx1NEVGNl0gXHU2QjY0XHU2M0QyXHU0RUY2XHU1M0VGXHU4MEZEXHU4MUVBXHU1RTI2XHU3RkZCXHU4QkQxXHU1MjlGXHU4MEZEYCB9KTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLmRlc2NFbC5jcmVhdGVEaXYoeyB0ZXh0OiAnXHUyMDBFJyB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vXHU0RTBEXHU1QjU4XHU1NzI4XHU4QkQxXHU2NTg3XHJcbiAgICAgICAgICAgICAgICBibG9jay5kZXNjRWwuY3JlYXRlRGl2KHsgdGV4dDogYFtcdTY3MkNcdTU3MzBdIFx1NjBBOFx1OEZEOFx1NjcyQVx1NjNEMFx1NTNENlx1OEJEMVx1NjU4N2AgfSk7XHJcbiAgICAgICAgICAgICAgICBibG9jay5kZXNjRWwuY3JlYXRlRGl2KHsgdGV4dDogJ1x1MjAwRScgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vIFx1NjI1M1x1NUYwMFx1NjNEMlx1NEVGNlx1OEJCRVx1N0Y2RVxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5JMThOX09QRU5fU0VUVElOR1MgJiYgdGhpcy5lbmFibGVkUGx1Z2lucy5oYXMocGx1Z2luLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3BlblBsdWdpblNldHRpbmcgPSBuZXcgRXh0cmFCdXR0b25Db21wb25lbnQoYmxvY2suY29udHJvbEVsKTtcclxuICAgICAgICAgICAgICAgIG9wZW5QbHVnaW5TZXR0aW5nLnNldEljb24oJ3NldHRpbmdzJyk7XHJcbiAgICAgICAgICAgICAgICBvcGVuUGx1Z2luU2V0dGluZy5zZXRUb29sdGlwKCdcdTYyNTNcdTVGMDBcdTYzRDJcdTRFRjZcdThCQkVcdTdGNkUnKTtcclxuICAgICAgICAgICAgICAgIG9wZW5QbHVnaW5TZXR0aW5nLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZW5QbHVnaW5TZXR0aW5nLnNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1BsdWdpbnMub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ1BsdWdpbnMub3BlblRhYkJ5SWQocGx1Z2luLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gXHU2MjUzXHU1RjAwXHU2M0QyXHU0RUY2XHU3NkVFXHU1RjU1KFx1NjI1M1x1NUYwMClcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxyXG4gICAgICAgICAgICBpZiAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3BlblBsdWdpbkRpciA9IG5ldyBFeHRyYUJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG4gICAgICAgICAgICAgICAgb3BlblBsdWdpbkRpci5zZXRJY29uKCdmb2xkZXItb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgb3BlblBsdWdpbkRpci5zZXRUb29sdGlwKCdcdTYyNTNcdTVGMDBcdTYzRDJcdTRFRjZcdTc2RUVcdTVGNTUnKTtcclxuICAgICAgICAgICAgICAgIG9wZW5QbHVnaW5EaXIub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlblBsdWdpbkRpci5zZXREaXNhYmxlZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvV2luL2kpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSBgcG93ZXJzaGVsbC5leGUgLUNvbW1hbmQgXCJJbnZva2UtSXRlbSBcXFxcXCIke3BsdWdpbkRpcn1cXFxcXCJcImA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWMoY29tbWFuZCwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NjI1M1x1NUYwMFx1NzZFRVx1NUY1NScsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGljZU9wZXJhdGlvblJlc3VsdCgnXHU2MjUzXHU1RjAwXHU3NkVFXHU1RjU1JywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBvcGVuUGx1Z2luRGlyLnNldERpc2FibGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vIFx1NkUwNVx1N0E3QVx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNihcdTUyMjBcdTk2NjQpXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGlmIChpc0xhbmdEaXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVBsdWdpbkRpckJ1dHRvbiA9IG5ldyBFeHRyYUJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlUGx1Z2luRGlyQnV0dG9uLnNldEljb24oJ3RyYXNoJyk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGVQbHVnaW5EaXJCdXR0b24uc2V0VG9vbHRpcCgnXHU1MjIwXHU5NjY0XHU4QkQxXHU2NTg3XHU3NkVFXHU1RjU1Jyk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGVQbHVnaW5EaXJCdXR0b24ub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlUGx1Z2luRGlyQnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFx1NUY1M1x1NEUzQVx1NURGMlx1N0ZGQlx1OEJEMVx1NzJCNlx1NjAwMVx1NjVGNlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGVPYmouc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gXHU1MjIwXHU5NjY0XHU1REYyXHU3RkZCXHU4QkQxXHU0RUUzXHU3ODAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5yZW1vdmVTeW5jKG1haW5Eb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMi4gXHU4RkQ4XHU1MzlGXHU1OTA3XHU0RUZEXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5yZW5hbWVTeW5jKGR1cGxpY2F0ZURvYywgbWFpbkRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAzLiBcdThCRkJcdTUzRDZcdThCRDFcdTY1ODdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uSnNvbiA9IGZzLnJlYWRKc29uU3luYyhsYW5nRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvbkpzb24uaGFzT3duUHJvcGVydHkoXCJkZXNjcmlwdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQuIFx1OEJGQlx1NTNENiBtYW5pZmVzdC5qc29uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFuaWZlc3RKU09OID0gZnMucmVhZEpzb25TeW5jKG1hbmlmZXN0RG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA1LiBcdThGRDhcdTUzOUYgbWFuaWZlc3QuanNvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hbmlmZXN0SlNPTi5kZXNjcmlwdGlvbiA9IHRyYW5zbGF0aW9uSnNvbi5kZXNjcmlwdGlvbi5vcmlnaW5hbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA2LiBcdTUxOTlcdTUxNjUgbWFuaWZlc3QuanNvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlSnNvblN5bmMobWFuaWZlc3REb2MsIG1hbmlmZXN0SlNPTiwgeyBzcGFjZXM6IDQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXHU5MDEyXHU1RjUyXHU1MjIwXHU5NjY0XHU2MjQwXHU2NzA5XHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLnJlbW92ZVN5bmMobGFuZ0Rpcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsb2FkUGx1Z2luKHBsdWdpbi5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vdGljZU9wZXJhdGlvblJlc3VsdCgnXHU1MjIwXHU5NjY0XHU4QkQxXHU2NTg3JywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTm90aWNlT3BlcmF0aW9uUmVzdWx0KCdcdTUyMjBcdTk2NjRcdThCRDFcdTY1ODcnLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFNob3dEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICAvLyBcdTdGMTZcdThGOTFcdThCRDFcdTY1ODdcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9FRElUX01PREUgJiYgaXNMYW5nRG9jKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVQbHVnaW5EaXJCdXR0b24gPSBuZXcgRXh0cmFCdXR0b25Db21wb25lbnQoYmxvY2suY29udHJvbEVsKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZVBsdWdpbkRpckJ1dHRvbi5zZXRJY29uKCdwZW5jaWwnKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZVBsdWdpbkRpckJ1dHRvbi5zZXRUb29sdGlwKCdcdTdGMTZcdThGOTFcdThCRDFcdTY1ODcnKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZVBsdWdpbkRpckJ1dHRvbi5vbkNsaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGVQbHVnaW5EaXJCdXR0b24uc2V0RGlzYWJsZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1dpbi9pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kID0gYHBvd2Vyc2hlbGwuZXhlIC1Db21tYW5kIFwiSW52b2tlLUl0ZW0gXFxcXFwiJHtsYW5nRG9jfVxcXFxcIlwiYDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhlYyhjb21tYW5kLCAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikgeyBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NjI1M1x1NUYwMFx1OEJEMVx1NjU4NycsIGZhbHNlLCBlcnJvcik7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NjI1M1x1NUYwMFx1OEJEMVx1NjU4NycsIHRydWUpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbignaHR0cHM6Ly93d3cuanNvbi5jbi9qc29uZWRpdC8nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFNob3dEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICAvLyBcdThCRDFcdTY1ODdcdTYzRDBcdTRFQTRcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9TVUJNSVRfVFJBTlNMQVRJT05fTU9ERSAmJiBpc0xhbmdEb2MgJiYgdHJhbnNsYXRpb25Gb3JtYXRNYXJrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJtaXRSZXJuc2xhdGlvbkJ1dHRvbiA9IG5ldyBFeHRyYUJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG4gICAgICAgICAgICAgICAgc3VibWl0UmVybnNsYXRpb25CdXR0b24uc2V0SWNvbignY2xvdWQtdXBsb2FkJyk7XHJcbiAgICAgICAgICAgICAgICBzdWJtaXRSZXJuc2xhdGlvbkJ1dHRvbi5zZXRUb29sdGlwKCdcdTYzRDBcdTRFQTRcdThCRDFcdTY1ODcnKTtcclxuICAgICAgICAgICAgICAgIHN1Ym1pdFJlcm5zbGF0aW9uQnV0dG9uLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBHaXRJc3N1ZU1vZGFsKHRoaXMuYXBwLCBwbHVnaW4uaWQsIHBsdWdpbi52ZXJzaW9uLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbkpzb246IFRyYW5zbGF0aW9uID0gZnMucmVhZEpTT05TeW5jKGxhbmdEb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGVKc29uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwbHVnaW4uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiB0cmFuc2xhdGlvbkpzb24ubWFuaWZlc3QuYXV0aG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uVmVyc2lvbjogdHJhbnNsYXRpb25Kc29uLm1hbmlmZXN0LnZlcnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luVmVyc2lvbjogdHJhbnNsYXRpb25Kc29uLm1hbmlmZXN0LnBsdWdpblZlcnNpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGF3YWl0IHRoaXMuaTE4bi5hcGkuZ2l0ZWVJc3N1ZShKU09OLnN0cmluZ2lmeSh0aXRsZUpzb24pLCBKU09OLnN0cmluZ2lmeSh0cmFuc2xhdGlvbkpzb24pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cmwgIT0gbnVsbCkgd2luZG93Lm9wZW4oYGh0dHBzOi8vZ2l0ZWUuY29tL3plcm8tLXR3by9vYnNpZGlhbi1pMThuLXRyYW5zbGF0aW9uL2lzc3Vlcy8ke3VybH1gLCAnX2JsYW5rJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1OEJEMVx1NjU4N1x1NjNEMFx1NEVBNCcsIGZhbHNlLCBgJHtlcnJvcn1gKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICNlbmRyZWdpb25cclxuXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIFx1NjcyQ1x1NTczMFx1OEJEMVx1NjU4N1x1N0ZGQlx1OEJEMShcdTYzRDBcdTUzRDYpIFxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9NT0RFX0xEVCAmJiAhaXNMYW5nRG9jKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBMRFRHZW5lcmF0ZUJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQoYmxvY2suY29udHJvbEVsKTtcclxuICAgICAgICAgICAgICAgIExEVEdlbmVyYXRlQnV0dG9uLnNldEJ1dHRvblRleHQoJ1x1NjNEMFx1NTNENicpO1xyXG4gICAgICAgICAgICAgICAgTERUR2VuZXJhdGVCdXR0b24uc2V0VG9vbHRpcCgnXHU2M0QwXHU1M0Q2XHU4QkQxXHU2NTg3Jyk7XHJcbiAgICAgICAgICAgICAgICBMRFRHZW5lcmF0ZUJ1dHRvbi5vbkNsaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBMRFRHZW5lcmF0ZUJ1dHRvbi5zZXREaXNhYmxlZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBcdTgzQjdcdTUzRDYgbWFpbi5qcyBcdTVCNTdcdTdCMjZcdTRFMzJcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFpblN0ciA9IGZzLnJlYWRGaWxlU3luYyhtYWluRG9jKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLiBcdTgzQjdcdTUzRDYgbWFuaWZlc3QuanNvbiBKU09OXHU2NTg3XHU2NzJDXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0SlNPTiA9IGZzLnJlYWRKc29uU3luYyhtYW5pZmVzdERvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMuIFx1NzUxRlx1NjIxMFx1OEJEMVx1NjU4N1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbkpzb24gPSBnZW5lcmF0ZVRyYW5zbGF0aW9uKHBsdWdpbi5pZCwgdGhpcy5zZXR0aW5ncy5JMThOX0FVVEhPUiwgXCIxLjAuMFwiLCBwbHVnaW4udmVyc2lvbiwgbWFuaWZlc3RKU09OLCBtYWluU3RyLCB0aGlzLnNldHRpbmdzLkkxOE5fUkVfTEVOR1RILCB0aGlzLnJlZ2V4cHMsIHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9GTEFHUyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQuIFx1Nzg2RVx1NEZERFx1OEJFRFx1OEEwMFx1NzZFRVx1NUY1NVx1NUI1OFx1NTcyOFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGxhbmdEaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA1LiBcdTVDMDYgXHU4QkQxXHU2NTg3anNvbiBcdTUxOTlcdTUxNjVcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVKc29uU3luYyhsYW5nRG9jLCB0cmFuc2xhdGlvbkpzb24sIHsgc3BhY2VzOiA0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NjNEMFx1NTNENicsIHRydWUsICdcdTVCRkNcdTgyMkFcdTgxRjNcdTYzRDJcdTRFRjZcdTVCODlcdTg4QzVcdTc2RUVcdTVGNTVcXG5cdTYyNEJcdTUyQThcdTdGRkJcdThCRDFcdTYwQThcdTc2ODRcdThCRDFcdTY1ODdcXG5cdTYyMTZcdTRGN0ZcdTc1MjhcdTdGMTZcdThGOTFcdTZBMjFcdTVGMEYnKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NjNEMFx1NTNENicsIGZhbHNlLCBgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxvYWRTaG93RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgXHU3RjUxXHU3RURDXHU4QkQxXHU2NTg3XHU3RkZCXHU4QkQxKFx1NEUwQlx1OEY3RFx1MzAwMVx1NjZGNFx1NjVCMClcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9ORFQgJiYgdGhpcy5pMThuLmRpcmVjdG9yeU1hcmsgJiYgY2xvdWRUcmFuc2xhdGlvbk1hbmlmZXN0SnNvbiAhPSB1bmRlZmluZWQgJiYgdHJhbnNsYXRpb25Gb3JtYXRNYXJrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdTYzRDJcdTRFRjZcdTcyNDhcdTY3MkNcdTY4MDdcdThCQjAoXHU3RjUxXHU3RURDXHU0RTBBXHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHU3NkY4XHU1NDBDXHU3MjQ4XHU2NzJDXHU3Njg0XHU4QkQxXHU2NTg3KVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgcGx1Z2luVmVyc2lvbk1ha2UgPSBjbG91ZFRyYW5zbGF0aW9uTWFuaWZlc3RKc29uLnRyYW5zbGF0aW9ucy5maW5kKHRyYW5zbGF0aW9uID0+IHRyYW5zbGF0aW9uLnBsdWdpblZlcnNpb24gPT09IHBsdWdpbi52ZXJzaW9uKSAhPT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLy8gXHU3MjQ4XHU2NzJDXHU2ODA3XHU4QkIwKFx1NUI1OFx1NTcyOCBcdTUyMTlcdThGRDRcdTU2REVcdTc2RjhcdTU0MEMgXHU0RTBEXHU1QjU4XHU1NzI4XHU4RDIzXHU4RkQ0XHU1NkRFXHU2NzAwXHU2NUIwXHU3Njg0XHU0RTAwXHU0RTJBKVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgdmVyc2lvbiA9IHBsdWdpblZlcnNpb25NYWtlID8gcGx1Z2luLnZlcnNpb24gOiBjbG91ZFRyYW5zbGF0aW9uTWFuaWZlc3RKc29uLnRyYW5zbGF0aW9ucy5zbGljZSgtMSlbMF0ucGx1Z2luVmVyc2lvbjtcclxuICAgICAgICAgICAgICAgIC8vIFx1OEJEMVx1NjU4N1x1NUJGOVx1OEM2MVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRpb25NYW5pZmVzdEpTT04gPSBjbG91ZFRyYW5zbGF0aW9uTWFuaWZlc3RKc29uLnRyYW5zbGF0aW9ucy5maW5kKHRyYW5zbGF0aW9uID0+IHRyYW5zbGF0aW9uLnBsdWdpblZlcnNpb24gPT09IHZlcnNpb24pO1xyXG4gICAgICAgICAgICAgICAgLy8gXHU2NzJDXHU1NzMwXHU4QkQxXHU2NTg3XHU2ODA3XHU4QkIwKFx1NTIyNFx1NjVBRFx1NjcyQ1x1NTczMFx1OEJEMVx1NjU4N1x1NTQ4Q1x1N0Y1MVx1N0VEQ1x1NEUyRFx1NjcwMFx1NjVCMFx1OEJEMVx1NjU4N1x1NjYyRlx1NTQyNlx1NTMzOVx1OTE0RClcclxuICAgICAgICAgICAgICAgIC8vIGxldCB0cmFuc2xhdGlvblZlcnNpb25NYWtlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoaXNMYW5nRG9jICYmIHRyYW5zbGF0aW9uTWFuaWZlc3RKU09OICE9IHVuZGVmaW5lZCkgeyB0cmFuc2xhdGlvblZlcnNpb25NYWtlID0gZnMucmVhZEpzb25TeW5jKGxhbmdEb2MpLm1hbmlmZXN0LnZlcnNpb24gPT0gdHJhbnNsYXRpb25NYW5pZmVzdEpTT04udHJhbnNsYXRpb25WZXJzaW9uID8gZmFsc2UgOiB0cnVlOyB9XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDEuIFx1NjcyQ1x1NTczMFx1NUI1OFx1NTcyOFx1OEJEMVx1NjU4N1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE5EVFVwZGF0ZUJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQoYmxvY2suY29udHJvbEVsKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTY3MkNcdTU3MzBcdTVCNThcdTU3MjhcdThCRDFcdTY1ODdcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTdGNTFcdTdFRENcdTU0OENcdTVGNTNcdTUyNERcdThCRDFcdTY1ODdcdTcyNDhcdTY3MkNcdTUzRjdcdTRFMERcdTU0MENcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShpc0xhbmdEb2MgJiYgaXNUcmFuc2xhdGlvblZlcnNpb25TYW1lTWFyaykpIE5EVFVwZGF0ZUJ1dHRvbi5zZXRDbGFzcygnaTE4bl9kaXNwbGF5LW5vbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBORFRVcGRhdGVCdXR0b24uc2V0QnV0dG9uVGV4dCgnXHU2NkY0XHU2NUIwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgTkRUVXBkYXRlQnV0dG9uLnNldFRvb2x0aXAodCgnTkRUX1VQREFURV9UT09MVElQJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIE5EVFVwZGF0ZUJ1dHRvbi5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTkRUVXBkYXRlQnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUpzb25TeW5jKGxhbmdEb2MsIGF3YWl0IHRoaXMuaTE4bi5hcGkudHJhbnNsYXRpb24ocGx1Z2luLmlkLCBsYXRlc3RDbG91ZFZlcnNpb24pLCB7IHNwYWNlczogNCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWxvYWRTaG93RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDEuIFx1NjcyQ1x1NTczMFx1NEUwRFx1NUI1OFx1NTcyOFx1OEJEMVx1NjU4N1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE5EVERvd25sb2FkQnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0xhbmdEb2MpIE5EVERvd25sb2FkQnV0dG9uLnNldENsYXNzKCdpMThuX2Rpc3BsYXktbm9uZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIE5EVERvd25sb2FkQnV0dG9uLnNldEJ1dHRvblRleHQoJ1x1NEUwQlx1OEY3RCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIE5EVERvd25sb2FkQnV0dG9uLnNldFRvb2x0aXAodCgnTkRUX0RPV05MT0FEX1RPT0xUSVAnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgTkRURG93bmxvYWRCdXR0b24ub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5EVERvd25sb2FkQnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGxhbmdEaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUpzb25TeW5jKGxhbmdEb2MsIGF3YWl0IHRoaXMuaTE4bi5hcGkudHJhbnNsYXRpb24ocGx1Z2luLmlkLCBsYXRlc3RDbG91ZFZlcnNpb24pLCB7IHNwYWNlczogNCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWxvYWRTaG93RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBQTm90aWNlKCdcdTk1MTlcdThCRUYnLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgXHU3RjUxXHU3RURDXHU2M0E1XHU1M0UzXHU3RkZCXHU4QkQxKFx1NzUxRlx1NjIxMClcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLkkxOE5fTU9ERV9OSVQgJiYgIWlzTGFuZ0RvYykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgTklUR2VuZXJhdGVCdXR0b24gPSBuZXcgQnV0dG9uQ29tcG9uZW50KGJsb2NrLmNvbnRyb2xFbCk7XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBOSVRHZW5lcmF0ZUJ1dHRvbi5zZXRCdXR0b25UZXh0KEFQSV9UWVBFU1t0aGlzLnNldHRpbmdzLkkxOE5fTklUX0FQSV0pO1xyXG4gICAgICAgICAgICAgICAgTklUR2VuZXJhdGVCdXR0b24uc2V0VG9vbHRpcCh0KCdOSVRfR0VORVJBVEVfVE9PTFRJUCcpKTtcclxuICAgICAgICAgICAgICAgIE5JVEdlbmVyYXRlQnV0dG9uLnNldEN0YSgpO1xyXG4gICAgICAgICAgICAgICAgTklUR2VuZXJhdGVCdXR0b24ub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTklUR2VuZXJhdGVCdXR0b24uc2V0RGlzYWJsZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFpblN0ciA9IGZzLnJlYWRGaWxlU3luYyhtYWluRG9jKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLiBcdTgzQjdcdTUzRDYgbWFuaWZlc3QuanNvbiBKU09OXHU2NTg3XHU2NzJDXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0SlNPTiA9IGZzLnJlYWRKc29uU3luYyhtYW5pZmVzdERvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMuIFx1OEY2Q1x1NjM2Mlx1NEUzQVx1OEJEMVx1NjU4N1x1NjgzQ1x1NUYwRlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbkpzb24gPSBnZW5lcmF0ZVRyYW5zbGF0aW9uKHBsdWdpbi5pZCwgdGhpcy5zZXR0aW5ncy5JMThOX0FVVEhPUiwgXCIxLjAuMFwiLCBwbHVnaW4udmVyc2lvbiwgbWFuaWZlc3RKU09OLCBtYWluU3RyLCB0aGlzLnNldHRpbmdzLkkxOE5fUkVfTEVOR1RILCB0aGlzLnJlZ2V4cHMsIHRoaXMuc2V0dGluZ3MuSTE4Tl9SRV9GTEFHUyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gLyhbJ1wiYF0pKC4qKShcXDEpLztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcdTc2N0VcdTVFQTZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJID09ICdCQUlEVScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5pMThuLmFwaS5iYWlkdSh0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24ub3JpZ2luYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCd0cmFuc19yZXN1bHQnIGluIHJlc3BvbnNlLmpzb24pIHsgdHJhbnNsYXRpb25Kc29uLmRlc2NyaXB0aW9uLnRyYW5zbGF0aW9uID0gcmVzcG9uc2UuanNvblsndHJhbnNfcmVzdWx0J11bMF1bJ2RzdCddIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyB0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24ub3JpZ2luYWw7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNsZWVwKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJX0lOVEVSVkFMKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRyYW5zbGF0aW9uSnNvbi5kaWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWNlSW5mbygnXHU3NTFGXHU2MjEwJywgYCR7dGVtcCArPSAxfS8ke09iamVjdC5rZXlzKHRyYW5zbGF0aW9uSnNvbi5kaWN0KS5sZW5ndGh9YCwgdGhpcy5zZXR0aW5ncy5JMThOX05JVF9BUElfSU5URVJWQUwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBBcnJheSA9IGtleS5tYXRjaChyZWdleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBBcnJheSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5pMThuLmFwaS5iYWlkdSh0ZW1wQXJyYXlbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJ3RyYW5zX3Jlc3VsdCcgaW4gcmVzcG9uc2UuanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRpb25Kc29uLmRpY3Rba2V5XSA9IGtleS5yZXBsYWNlKHRlbXBBcnJheVsyXSwgcmVzcG9uc2UuanNvblsndHJhbnNfcmVzdWx0J11bMF1bJ2RzdCddKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uSnNvbi5kaWN0W2tleV0gPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc2xlZXAodGhpcy5zZXR0aW5ncy5JMThOX05JVF9BUElfSU5URVJWQUwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPUEVOQUlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJID09ICdPUEVOQUknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA0LiBcdTdGRkJcdThCRDEgXHU2M0NGXHU4RkYwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuaTE4bi5hcGkub3BlbkFJKHBsdWdpbi5uYW1lLCB0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24ub3JpZ2luYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCdjb250ZW50JyBpbiByZXNwb25zZSkgeyB0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24udHJhbnNsYXRpb24gPSByZXNwb25zZS5jb250ZW50IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyB0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24ub3JpZ2luYWw7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNsZWVwKHRoaXMuc2V0dGluZ3MuSTE4Tl9OSVRfQVBJX0lOVEVSVkFMKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDUuIFx1N0ZGQlx1OEJEMSBcdTVCNTdcdTUxNzhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRyYW5zbGF0aW9uSnNvbi5kaWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWNlSW5mbygnXHU3NTFGXHU2MjEwJywgYCR7dGVtcCArPSAxfS8ke09iamVjdC5rZXlzKHRyYW5zbGF0aW9uSnNvbi5kaWN0KS5sZW5ndGh9YCwgdGhpcy5zZXR0aW5ncy5JMThOX05JVF9BUElfSU5URVJWQUwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBBcnJheSA9IGtleS5tYXRjaChyZWdleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBBcnJheSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5pMThuLmFwaS5vcGVuQUkocGx1Z2luLm5hbWUsIHRlbXBBcnJheVsyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgnY29udGVudCcgaW4gcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uSnNvbi5kaWN0W2tleV0gPSBrZXkucmVwbGFjZSh0ZW1wQXJyYXlbMl0sIHJlc3BvbnNlLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRpb25Kc29uLmRpY3Rba2V5XSA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzbGVlcCh0aGlzLnNldHRpbmdzLkkxOE5fTklUX0FQSV9JTlRFUlZBTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMobGFuZ0Rpcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlSnNvblN5bmMobGFuZ0RvYywgdHJhbnNsYXRpb25Kc29uLCB7IHNwYWNlczogNCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1NEU5MVx1N0FFRlx1OEJEMVx1NjU4NycsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVsb2FkU2hvd0RhdGEoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIFx1NjNEMlx1NEVGNlx1NTdGQVx1Nzg0MFx1NTI5Rlx1ODBGRChcdTdGRkJcdThCRDEgXHU4RkQ4XHU1MzlGKVxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgaWYgKGlzU3RhdGVEb2MgJiYgaXNMYW5nRG9jICYmIHRyYW5zbGF0aW9uRm9ybWF0TWFyaykge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTdGRkJcdThCRDFcdTYzMDlcdTk0QUVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBUcmVuc2xhdG9yQnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRyZW5zbGF0b3JCdXR0b24uc2V0QnV0dG9uVGV4dCgnXHU3RkZCXHU4QkQxJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgVHJlbnNsYXRvckJ1dHRvbi5zZXRUb29sdGlwKCdcdTdGRkJcdThCRDFcdTYzRDJcdTRFRjYnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShzdGF0ZU9iai5zdGF0ZSgpID09IGZhbHNlKSkgVHJlbnNsYXRvckJ1dHRvbi5zZXRDbGFzcygnaTE4bl9kaXNwbGF5LW5vbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBUcmVuc2xhdG9yQnV0dG9uLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUcmVuc2xhdG9yQnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBcdTU5MERcdTUyMzZcdTU5MDdcdTRFRkRcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weVN5bmMobWFpbkRvYywgZHVwbGljYXRlRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMi4gXHU4QkZCXHU1M0Q2XHU4QkQxXHU2NTg3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uSnNvbiA9IGZzLnJlYWRKc29uU3luYyhsYW5nRG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMy4gXHU4QkZCXHU1M0Q2IG1haW4uanNcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1haW5TdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMobWFpbkRvYykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNC4gXHU3RkZCXHU4QkQxIG1haW4uanNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdHJhbnNsYXRpb25Kc29uLmRpY3QpIG1haW5TdHJpbmcgPSBtYWluU3RyaW5nLnJlcGxhY2VBbGwoa2V5LCB0cmFuc2xhdGlvbkpzb24uZGljdFtrZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNS4gXHU1MTk5XHU1MTY1IG1haW4uanNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhtYWluRG9jLCBtYWluU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNi4gXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4ZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0aW9uSnNvbi5oYXNPd25Qcm9wZXJ0eShcImRlc2NyaXB0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA3LiBcdThCRkJcdTUzRDYgbWFuaWZlc3QuanNvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFuaWZlc3RKU09OID0gZnMucmVhZEpzb25TeW5jKG1hbmlmZXN0RG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDguIFx1N0ZGQlx1OEJEMSBtYW5pZmVzdC5qc29uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYW5pZmVzdEpTT04uZGVzY3JpcHRpb24gPSB0cmFuc2xhdGlvbkpzb24uZGVzY3JpcHRpb24udHJhbnNsYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA5LiBcdTUxOTlcdTUxNjUgbWFuaWZlc3QuanNvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVKc29uU3luYyhtYW5pZmVzdERvYywgbWFuaWZlc3RKU09OLCB7IHNwYWNlczogNCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxMC4gXHU2NkY0XHU2NUIwXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlT2JqLnVwZGF0ZSh0cnVlLCBwbHVnaW4udmVyc2lvbiwgdHJhbnNsYXRpb25Kc29uLm1hbmlmZXN0LnZlcnNpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxMS4gXHU2M0QyXHU0RUY2XHU1OTMxXHU2NTQ4XHU2M0QwXHU3OTNBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZWRQbHVnaW5zLmhhcyhwbHVnaW4uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFBsdWdpbihwbHVnaW4uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vdGljZU9wZXJhdGlvblJlc3VsdCgnXHU3RkZCXHU4QkQxJywgdHJ1ZSwgJ1x1NTk4Mlx1OTA0N1x1N0ZGQlx1OEJEMVx1NTQwRVx1NjNEMlx1NEVGNlx1NTkzMVx1NjU0OFxcblx1OEJGNFx1NjYwRVx1OEJEMVx1NjU4N1x1NTNFRlx1ODBGRFx1NTFGQVx1NzNCMFx1OTVFRVx1OTg5OFxcblx1NzBCOVx1NTFGQlx1OEZEOFx1NTM5Rlx1NTM3M1x1NTNFRlx1NjA2Mlx1NTkwRFx1NTM5Rlx1NzJCNicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxMi4gXHU1MjM3XHU2NUIwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsb2FkU2hvd0RhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU4RkQ4XHU1MzlGXHU2MzA5XHU5NEFFXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgUmVzdG9yZUJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQoYmxvY2suY29udHJvbEVsKTtcclxuICAgICAgICAgICAgICAgICAgICBSZXN0b3JlQnV0dG9uLnNldEJ1dHRvblRleHQoJ1x1OEZEOFx1NTM5RicpO1xyXG4gICAgICAgICAgICAgICAgICAgIFJlc3RvcmVCdXR0b24uc2V0VG9vbHRpcCgnXHU4RkQ4XHU1MzlGXHU2M0QyXHU0RUY2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoc3RhdGVPYmouc3RhdGUoKSA9PSB0cnVlKSkgUmVzdG9yZUJ1dHRvbi5zZXRDbGFzcygnaTE4bl9kaXNwbGF5LW5vbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBSZXN0b3JlQnV0dG9uLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZXN0b3JlQnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBcdTUyMjBcdTk2NjQgbWFpbi5qc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy51bmxpbmtTeW5jKG1haW5Eb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLiBcdTY2RkZcdTYzNjIgbWFpbi5qc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5yZW5hbWVTeW5jKGR1cGxpY2F0ZURvYywgbWFpbkRvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMuIFx1OEJGQlx1NTNENlx1OEJEMVx1NjU4N1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbkpzb24gPSBmcy5yZWFkSnNvblN5bmMobGFuZ0RvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQuIFx1NTIyNFx1NjVBRFx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvbkpzb24uaGFzT3duUHJvcGVydHkoXCJkZXNjcmlwdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNS4gXHU4QkZCXHU1M0Q2IG1hbmlmZXN0Lmpzb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0SlNPTiA9IGZzLnJlYWRKc29uU3luYyhtYW5pZmVzdERvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA2LiBcdThGRDhcdTUzOUYgbWFuaWZlc3QuanNvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFuaWZlc3RKU09OLmRlc2NyaXB0aW9uID0gdHJhbnNsYXRpb25Kc29uLmRlc2NyaXB0aW9uLm9yaWdpbmFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNy4gXHU1MTk5XHU1MTY1IG1hbmlmZXN0Lmpzb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlSnNvblN5bmMobWFuaWZlc3REb2MsIG1hbmlmZXN0SlNPTiwgeyBzcGFjZXM6IDQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gOC4gXHU2NkY0XHU2NUIwXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlT2JqLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDkuIFx1NjZGNFx1NjVCMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmFibGVkUGx1Z2lucy5oYXMocGx1Z2luLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxvYWRQbHVnaW4ocGx1Z2luLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb3RpY2VPcGVyYXRpb25SZXN1bHQoJ1x1OEZEOFx1NTM5RicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxMC4gXHU1MjM3XHU2NUIwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsb2FkU2hvd0RhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWNlT3BlcmF0aW9uUmVzdWx0KCdcdTdGRkJcdThCRDEnLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5kZXZlbG9wZXJNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmV3IEJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG4gICAgICAgICAgICAgICAgdGVzdC5zZXRCdXR0b25UZXh0KCdcdTZENEJcdThCRDUnKTtcclxuICAgICAgICAgICAgICAgIHRlc3Qub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5pMThuLm1hbmlmZXN0LmlkKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFtcdTkxQ0RcdThGN0RcdTY1NzBcdTYzNkVcdTY2M0VcdTc5M0FdXHJcbiAgICBhc3luYyByZWxvYWRTaG93RGF0YSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnXHU4QzAzXHU3NTI4XHU0RTg2W1x1NTIzN1x1NjVCMF0nKTtcclxuICAgICAgICAvLyBcdTZFREFcdTUyQThcdTY3NjFcdTVCOUFcdTRGNERcclxuICAgICAgICBsZXQgc2Nyb2xsVG9wID0gMDtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3QgbW9kYWxFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuY29udGVudEVsO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1vZGFsRWxlbWVudCk7XHJcbiAgICAgICAgc2Nyb2xsVG9wID0gbW9kYWxFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgICAgICAvLyBcdTRGN0ZcdTc1Mjggd2hpbGUgXHU1RkFBXHU3M0FGXHU0RUNFXHU2NzAwXHU1NDBFXHU0RTAwXHU0RTJBXHU1QjUwXHU1MTQzXHU3RDIwXHU1RjAwXHU1OUNCXHU1NDExXHU1MjREXHU5MDREXHU1Mzg2XHU1RTc2XHU1MjIwXHU5NjY0IFx1NEVDRVx1NjcwMFx1NTQwRVx1NEUwMFx1NEUyQVx1NUI1MFx1NTE0M1x1N0QyMFx1NUYwMFx1NTlDQlx1NTQxMVx1NTI0RFx1OTA0RFx1NTM4Nlx1RkYwQ1x1NEVFNVx1OTA3Rlx1NTE0RFx1NTcyOFx1OTA0RFx1NTM4Nlx1NjVGNlx1NUY3MVx1NTRDRFx1N0QyMlx1NUYxNSAgXHJcbiAgICAgICAgd2hpbGUgKHRoaXMuY29udGVudEVsLmZpcnN0Q2hpbGQpIHsgdGhpcy5jb250ZW50RWwucmVtb3ZlQ2hpbGQodGhpcy5jb250ZW50RWwuZmlyc3RDaGlsZCkgfVxyXG4gICAgICAgIC8vIFx1NTIzN1x1NjVCMFx1NUM1NVx1NzkzQVx1NjU3MFx1NjM2RVxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd0RhdGEoKTtcclxuICAgICAgICAvLyBcdTU5MERcdTUzOUZzY3JvbGxcdTRGNERcdTdGNkVcclxuICAgICAgICBtb2RhbEVsZW1lbnQuc2Nyb2xsVG8oMCwgc2Nyb2xsVG9wKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBbXHU1RjAwXHU1NDJGXVxyXG4gICAgYXN5bmMgb25PcGVuKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdcdThDMDNcdTc1MjhcdTRFODZbXHU1RjAwXHU1NDJGXScpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd0hlYWQoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNob3dEYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gW1x1NTE3M1x1OTVFRF1cclxuICAgIGFzeW5jIG9uQ2xvc2UoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1x1OEMwM1x1NzUyOFx1NEU4NltcdTUxNzNcdTk1RURdJyk7XHJcbiAgICAgICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZWxvYWRQbHVnaW4oaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWRQbHVnaW5zLmhhcyhpZCkpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC5wbHVnaW5zLmRpc2FibGVQbHVnaW4oaWQpO1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnBsdWdpbnMuZW5hYmxlUGx1Z2luKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCAiaW1wb3J0IHsgQXBwLCBCdXR0b25Db21wb25lbnQsIE1vZGFsLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vICAgICAgICAgIFx1NEZBN1x1OEZCOVx1NjgwRiBcdTVCRjlcdThCRERcdTY4NDYgXHU4RjZDXHU4QkQxXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5leHBvcnQgY2xhc3MgR2l0SXNzdWVNb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuICAgIG9uU3VibWl0OiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBib2R5OiBzdHJpbmdcclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCB0aXRsZTogc3RyaW5nLCBib2R5OiBzdHJpbmcsIG9uU3VibWl0OiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwKTtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcclxuICAgICAgICB0aGlzLm9uU3VibWl0ID0gb25TdWJtaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIE1haW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XHJcbiAgICAgICAgLy8gdGhpcy5jb250ZW50RWwuYWRkQ2xhc3MoJ2knKTtcclxuXHJcbiAgICAgICAgY29udGVudEVsLmNyZWF0ZUVsKFwiaDRcIiwgeyB0ZXh0OiBcIlx1NjNEMFx1NEVBNFx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNlwiIH0pO1xyXG4gICAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImRpdlwiLCB7IHRleHQ6IFwiXHU4QkY3XHU1MThEXHU2QjIxXHU3ODZFXHU4QkE0XHU2MEE4XHU3Njg0XHU2M0QwXHU0RUE0XCIgfSk7XHJcbiAgICAgICAgY29udGVudEVsLmNyZWF0ZUVsKFwiZGl2XCIsIHsgdGV4dDogXCJcdTc4NkVcdTRGRERcdTZCQ0ZcdTRFMDBcdTRFRkRcdTUyQUFcdTUyOUJcdTkwRkRcdTgwRkRcdTY3MDlcdTY1NDhcdThEMjFcdTczMkVcIiB9KTtcclxuICAgICAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJkaXZcIiwgeyB0ZXh0OiBcIlx1OTA3Rlx1NTE0RFx1NjVFMFx1NjU0OFx1NTE4NVx1NUJCOVx1NTM2MFx1NzUyOFx1NUI5RFx1OEQzNVx1OEQ0NFx1NkU5MFx1NTRFNlwiIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBidXR0b25CbG9jayA9IG5ldyBTZXR0aW5nKGNvbnRlbnRFbCk7XHJcbiAgICAgICAgY29uc3QgY2FuY2VsQnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChidXR0b25CbG9jay5jb250cm9sRWwpO1xyXG4gICAgICAgIGNhbmNlbEJ1dHRvbi5zZXRCdXR0b25UZXh0KCdcdTUzRDZcdTZEODgnKTtcclxuICAgICAgICBjYW5jZWxCdXR0b24ub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBuZXcgQnV0dG9uQ29tcG9uZW50KGJ1dHRvbkJsb2NrLmNvbnRyb2xFbCk7XHJcbiAgICAgICAgc3VibWl0QnV0dG9uLnNldEJ1dHRvblRleHQoJ1x1NjNEMFx1NEVBNCcpO1xyXG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5zZXRDdGEoKTtcclxuICAgICAgICBzdWJtaXRCdXR0b24ub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25TdWJtaXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbG9hZCgpIHtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgdGhpcy5vcGVuKCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBvbk9wZW4oKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5NYWluKCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBvbkNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XHJcbiAgICB9XHJcbn0iLCAiaW1wb3J0IHsgQXBwLCBCdXR0b25Db21wb25lbnQsIE1vZGFsLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgSTE4TiBmcm9tICdtYWluJztcclxuaW1wb3J0IFVybCBmcm9tICdzcmMvdXJsJztcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyAgICAgICAgICBcdTk5OTZcdTZCMjFcdThGRDBcdTg4NENcdTU0MTFcdTVCRkNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmV4cG9ydCBjbGFzcyBXaXphcmRNb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuICAgIGkxOG46IEkxOE47XHJcbiAgICBmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQ7XHJcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBodG1sOiBIVE1MRWxlbWVudDtcclxuICAgIHRpdGxlOiBIVE1MUGFyYWdyYXBoRWxlbWVudDtcclxuICAgIHZlcnNpb246IEhUTUxQYXJhZ3JhcGhFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGkxOG46IEkxOE4pIHtcclxuICAgICAgICBzdXBlcihhcHApO1xyXG4gICAgICAgIHRoaXMuaTE4biA9IGkxOG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgTWFpbigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNvbnRlbnRFbC5hZGRDbGFzcyhcImkxOG5fd2l6YXJkX21vZGFsXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmltZyA9IHRoaXMuY29udGVudEVsLmRvYy5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHRoaXMuaW1nLmFkZENsYXNzKCdpMThuX3dpemFyZF9tb2RhbF9pbWcnKTtcclxuICAgICAgICB0aGlzLmltZy5zcmMgPSBVcmwuSTE4Tl9JQ09OO1xyXG4gICAgICAgIHRoaXMuY29udGVudEVsLmFwcGVuZENoaWxkKHRoaXMuaW1nKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRoaXMuY29udGVudEVsLmRvYy5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICB0aGlzLnRpdGxlLmFkZENsYXNzKCdpMThuX3dpemFyZF9tb2RhbF90aXRsZScpO1xyXG4gICAgICAgIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gJ09ic2lkaWFuLUkxOE4nO1xyXG4gICAgICAgIHRoaXMuY29udGVudEVsLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnNpb24gPSB0aGlzLmNvbnRlbnRFbC5kb2MuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgdGhpcy52ZXJzaW9uLmFkZENsYXNzKCdpMThuX3dpemFyZF9tb2RhbF92ZXJzaW9uJyk7XHJcbiAgICAgICAgdGhpcy52ZXJzaW9uLmlubmVySFRNTCA9IGBcdTcyNDhcdTY3MkMgJHt0aGlzLmkxOG4ubWFuaWZlc3QudmVyc2lvbn1gO1xyXG4gICAgICAgIHRoaXMuY29udGVudEVsLmFwcGVuZENoaWxkKHRoaXMudmVyc2lvbik7XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZGVvVHV0b3JpYWwgPSBuZXcgU2V0dGluZyhjb250ZW50RWwpO1xyXG4gICAgICAgIHZpZGVvVHV0b3JpYWwuc2V0TmFtZSgnXHU1Qjk4XHU2NUI5XHU4OUM2XHU5ODkxXHU2NTU5XHU3QTBCJyk7XHJcbiAgICAgICAgdmlkZW9UdXRvcmlhbC5zZXREZXNjKCdcdThCRTZcdTVDM0RcdTZGMTRcdTc5M0FPYnNpZGlhbiBpMThuXHU2NENEXHU0RjVDXHVGRjBDXHU1MkE5XHU1MjlCXHU1RkVCXHU5MDFGXHU2MzhDXHU2M0UxJyk7XHJcbiAgICAgICAgY29uc3QgdmlkZW9UdXRvcmlhbEJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQodmlkZW9UdXRvcmlhbC5jb250cm9sRWwpO1xyXG4gICAgICAgIHZpZGVvVHV0b3JpYWxCdXR0b24uc2V0QnV0dG9uVGV4dCgnXHU2RDRGXHU4OUM4Jyk7XHJcbiAgICAgICAgdmlkZW9UdXRvcmlhbEJ1dHRvbi5zZXRDdGEoKTtcclxuICAgICAgICB2aWRlb1R1dG9yaWFsQnV0dG9uLnNldFRvb2x0aXAoJycpO1xyXG4gICAgICAgIHZpZGVvVHV0b3JpYWxCdXR0b24ub25DbGljaygoKSA9PiB7IHdpbmRvdy5vcGVuKFVybC5WSURFT19UVVRPUklBTCkgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvY3VtZW50YXRpb25UdXRvcmlhbCA9IG5ldyBTZXR0aW5nKGNvbnRlbnRFbCk7XHJcbiAgICAgICAgZG9jdW1lbnRhdGlvblR1dG9yaWFsLnNldE5hbWUoJ1x1NUI5OFx1NjVCOVx1NjU4N1x1Njg2M1x1NjU1OVx1N0EwQicpO1xyXG4gICAgICAgIGRvY3VtZW50YXRpb25UdXRvcmlhbC5zZXREZXNjKCdPYnNpZGlhbiBpMThuXHU3Njg0XHU1MTY4XHU5NzYyXHU2M0EyXHU3RDIyXHU0RTRCXHU2NUM1XHU2MzA3XHU1MzU3Jyk7XHJcbiAgICAgICAgY29uc3QgZG9jdW1lbnRhdGlvblR1dG9yaWFsQnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChkb2N1bWVudGF0aW9uVHV0b3JpYWwuY29udHJvbEVsKTtcclxuICAgICAgICBkb2N1bWVudGF0aW9uVHV0b3JpYWxCdXR0b24uc2V0QnV0dG9uVGV4dCgnXHU2RDRGXHU4OUM4Jyk7XHJcbiAgICAgICAgZG9jdW1lbnRhdGlvblR1dG9yaWFsQnV0dG9uLnNldFRvb2x0aXAoJycpO1xyXG4gICAgICAgIGRvY3VtZW50YXRpb25UdXRvcmlhbEJ1dHRvbi5vbkNsaWNrKCgpID0+IHsgd2luZG93Lm9wZW4oVXJsLkRPQ1VNRU5UQVRJT05fVFVUT1JJQUwpIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBjb21tdW5pdHkgPSBuZXcgU2V0dGluZyhjb250ZW50RWwpO1xyXG4gICAgICAgIGNvbW11bml0eS5zZXROYW1lKCdcdTVCOThcdTY1QjlRXHU3RkE0Jyk7XHJcbiAgICAgICAgY29tbXVuaXR5LnNldERlc2MoJ1x1NTcyOFx1NUI5OFx1NjVCOVx1N0ZBNFx1RkYwQ1x1NjBBOFx1NTNFRlx1NTNEMVx1NUUwM1x1OTcwMFx1NkM0Mlx1MzAwMVx1NjNEMFx1NEVBNEJVR1x1MzAwMVx1NTIwNlx1NEVBQlx1OEJEMVx1NjU4N1x1RkYwQ1x1NUU3Nlx1NEUwRVx1NTE3Nlx1NEVENlx1NzUyOFx1NjIzN1x1NUMzMVx1NjNEMlx1NEVGNlx1NEY3Rlx1NzUyOFx1MzAwMVx1N0ZGQlx1OEJEMVx1N0I0OVx1OEJERFx1OTg5OFx1NEVBNFx1NkQ0MVx1NEU5Mlx1NTJBOVx1MzAwMicpO1xyXG4gICAgICAgIGNvbnN0IGNvbW11bml0eUJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQoY29tbXVuaXR5LmNvbnRyb2xFbCk7XHJcbiAgICAgICAgY29tbXVuaXR5QnV0dG9uLnNldEJ1dHRvblRleHQoJ1x1NTJBMFx1NTE2NScpO1xyXG4gICAgICAgIGNvbW11bml0eUJ1dHRvbi5zZXRUb29sdGlwKCcnKTtcclxuICAgICAgICBjb21tdW5pdHlCdXR0b24ub25DbGljaygoKSA9PiB7IHdpbmRvdy5vcGVuKFVybC5RUV9HUk9VUCkgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uT3BlbigpIHsgYXdhaXQgdGhpcy5NYWluKCkgfVxyXG4gICAgYXN5bmMgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKSB9XHJcbn0iLCAiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cbnZhciBieXRlVG9IZXggPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICAvL1xuICAvLyBOb3RlIHRvIGZ1dHVyZS1zZWxmOiBObywgeW91IGNhbid0IHJlbW92ZSB0aGUgYHRvTG93ZXJDYXNlKClgIGNhbGwuXG4gIC8vIFJFRjogaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNjc3I2lzc3VlY29tbWVudC0xNzU3MzUxMzUxXG4gIHJldHVybiAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIHZhciB1dWlkID0gdW5zYWZlU3RyaW5naWZ5KGFyciwgb2Zmc2V0KTtcbiAgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuICByZXR1cm4gdXVpZDtcbn1cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCAiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG5cbnZhciBnZXRSYW5kb21WYWx1ZXM7XG52YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pO1xuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufSIsICJ2YXIgcmFuZG9tVVVJRCA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5yYW5kb21VVUlEICYmIGNyeXB0by5yYW5kb21VVUlELmJpbmQoY3J5cHRvKTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmFuZG9tVVVJRFxufTsiLCAiaW1wb3J0IG5hdGl2ZSBmcm9tICcuL25hdGl2ZS5qcyc7XG5pbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCB7IHVuc2FmZVN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIGlmIChuYXRpdmUucmFuZG9tVVVJRCAmJiAhYnVmICYmICFvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5hdGl2ZS5yYW5kb21VVUlEKCk7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7XG5cbiAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuICAgIHJldHVybiBidWY7XG4gIH1cbiAgcmV0dXJuIHVuc2FmZVN0cmluZ2lmeShybmRzKTtcbn1cbmV4cG9ydCBkZWZhdWx0IHY0OyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFFQSxZQUFRLGVBQWUsU0FBVSxJQUFJO0FBQ25DLGFBQU8sT0FBTyxlQUFlLFlBQWEsTUFBTTtBQUM5QyxZQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQyxNQUFNO0FBQVksYUFBRyxNQUFNLE1BQU0sSUFBSTtBQUFBLGFBQy9EO0FBQ0gs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QVM7QUFBZ0Isb0JBQWMsNEJBQVEsaURBQWM7QUFFdEksVUFBTSxnQkFBZ0IsTUFBTSxLQUFLLElBQUksY0FBYztBQUNuRCxRQUFJLEtBQUssU0FBUyxpQkFBaUIsS0FBSyxTQUFTLGlCQUFpQixLQUFLLFNBQVMsaUJBQWlCLGVBQWU7QUFDNUcsVUFBSTtBQUNBLGFBQUssWUFBWSxNQUFNLEtBQUssSUFBSSxVQUFVO0FBQzFDLDhCQUFzQiw0QkFBUSxJQUFJO0FBQUEsTUFDdEMsU0FBUyxPQUFQO0FBQ0UsYUFBSyxnQkFBZ0I7QUFDckIsOEJBQXNCLDRCQUFRLE9BQU8sS0FBSztBQUFBLE1BQzlDO0FBQUEsSUFDSixXQUFXLEtBQUssU0FBUyxpQkFBaUIsS0FBSyxTQUFTLGlCQUFpQixLQUFLLFNBQVMsaUJBQWlCLENBQUMsZUFBZTtBQUNwSCxXQUFLLGdCQUFnQjtBQUNyQiw0QkFBc0IsNEJBQVEsT0FBTywwQkFBTTtBQUFBLElBQy9DLE9BQU87QUFDSCxXQUFLLGdCQUFnQjtBQUFBLElBQ3pCO0FBQUEsRUFDSjtBQUFBO0FBQUEsRUFHQSxXQUFXO0FBQ1AsUUFBSSxLQUFLLFNBQVMsYUFBYTtBQUMzQixVQUFJLFlBQVksS0FBSyxLQUFLLElBQUksRUFBRSxLQUFLO0FBQ3JDLFdBQUssU0FBUyxZQUFZLFdBQU87QUFDakMsV0FBSyxTQUFTLGNBQWM7QUFDNUIsV0FBSyxhQUFhO0FBQUEsSUFDdEI7QUFBQSxFQUNKO0FBOEVKOzs7QURsTkEsSUFBTyxlQUFROyIsCiAgIm5hbWVzIjogWyJtb2R1bGUiLCAiZnMiLCAicGF0aCIsICJlcnIiLCAiZXJyMiIsICJlciIsICJlcjIiLCAibW9kdWxlIiwgImZzIiwgInBhdGgiLCAic2VsZiIsICJtb2R1bGUiLCAiZ2V0UHJvdG90eXBlT2YiLCAibW9kdWxlIiwgImZzIiwgIm5vb3AiLCAicXVldWUiLCAicGF0aCIsICJvcHRpb25zIiwgImNiIiwgImRhdGEiLCAic3JjIiwgImRlc3QiLCAiZmxhZ3MiLCAiZ28kcmVhZGRpciIsICJtb2RlIiwgImZzIiwgImJ1ZmZlciIsICJidWZmZXJzIiwgIm1vZHVsZSIsICJwYXRoIiwgIm1vZHVsZSIsICJmcyIsICJkZWZhdWx0cyIsICJtb2R1bGUiLCAibW9kdWxlIiwgImZzIiwgInBhdGgiLCAibW9kdWxlIiwgImZzIiwgInBhdGgiLCAibW9kdWxlIiwgImZzIiwgInBhdGgiLCAibW9kdWxlIiwgImZzIiwgInBhdGgiLCAiZGVzdFN0YXQiLCAibW9kdWxlIiwgImZzIiwgInBhdGgiLCAiY29weVN5bmMiLCAicmVxdWlyZV9jb3B5IiwgIm1vZHVsZSIsICJtb2R1bGUiLCAiZnMiLCAicGF0aCIsICJyZW1vdmVTeW5jIiwgIm1vZHVsZSIsICJmcyIsICJwYXRoIiwgImVtcHR5RGlyIiwgIm1vZHVsZSIsICJwYXRoIiwgImZzIiwgIm1vZHVsZSIsICJwYXRoIiwgImZzIiwgIm1vZHVsZSIsICJwYXRoIiwgImZzIiwgImV4aXN0cyIsICJtb2R1bGUiLCAiZnMiLCAibW9kdWxlIiwgInBhdGgiLCAiZnMiLCAibW9kdWxlIiwgInJlcXVpcmVfdXRpbHMiLCAibW9kdWxlIiwgIm1vZHVsZSIsICJmcyIsICJyZWFkRmlsZVN5bmMiLCAid3JpdGVGaWxlU3luYyIsICJyZXF1aXJlX2pzb25maWxlIiwgIm1vZHVsZSIsICJtb2R1bGUiLCAiZnMiLCAicGF0aCIsICJtb2R1bGUiLCAibW9kdWxlIiwgIm91dHB1dEpzb25TeW5jIiwgIm1vZHVsZSIsICJtb2R1bGUiLCAiZnMiLCAicGF0aCIsICJtb2R1bGUiLCAiZnMiLCAicGF0aCIsICJjb3B5U3luYyIsICJyZW1vdmVTeW5jIiwgInJlcXVpcmVfbW92ZSIsICJtb2R1bGUiLCAibW9kdWxlIiwgInBhdGgiLCAiZnMiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAicGF0aCIsICJpIiwgIkkxOG5IZWxwIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJwcm90b3R5cGUiLCAiZGVzY3JpcHRvcnMiLCAiZmlsdGVyIiwgImhhc093blByb3BlcnR5IiwgImZpbHRlciIsICJwYXRoIiwgInByb3RvdHlwZSIsICJ0b1N0cmluZyIsICJlbmNvZGUiLCAicGF0aCIsICJwYXRoIiwgImlzRm9ybURhdGEiLCAiaXNGaWxlTGlzdCIsICJ0cmFuc2l0aW9uYWwiLCAiZmlsdGVyIiwgInNlbGYiLCAicHJvdG90eXBlIiwgInZhbGlkYXRlU3RhdHVzIiwgInBhdGgiLCAibWVyZ2UiLCAidHJhbnNpdGlvbmFsIiwgInNpZ25hbCIsICJkb25lIiwgInJlcyIsICJ2YWxpZGF0b3JzIiwgInRyYW5zaXRpb25hbCIsICJBeGlvcyIsICJBeGlvc0Vycm9yIiwgIkNhbmNlbGVkRXJyb3IiLCAiaXNDYW5jZWwiLCAiQ2FuY2VsVG9rZW4iLCAiVkVSU0lPTiIsICJhbGwiLCAiaXNBeGlvc0Vycm9yIiwgInNwcmVhZCIsICJ0b0Zvcm1EYXRhIiwgIkF4aW9zSGVhZGVycyIsICJIdHRwU3RhdHVzQ29kZSIsICJtZXJnZUNvbmZpZyIsICJSZXF1ZXN0VXJsUGFyYW0iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJwYXRoIiwgImZzIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgInRlc3QiLCAicmVzcG9uc2UiXQp9Cg==
