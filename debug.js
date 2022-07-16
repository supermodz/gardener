
function createDebug(namespace) {
  var prevTime;

  function debug() {
    // Disabled?
    if (!debug.enabled) {
      return;
    }

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var self = debug; // Set `diff` timestamp

    var curr = Number(new Date());
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;
    args[0] = createDebug.coerce(args[0]);

    if (typeof args[0] !== 'string') {
      // Anything else let's inspect with %O
      args.unshift('%O');
    } // Apply any `formatters` transformations


    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // If we encounter an escaped % then don't increase the array index
      if (match === '%%') {
        return match;
      }

      index++;
      var formatter = createDebug.formatters[format];

      if (typeof formatter === 'function') {
        var val = args[index];
        match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

        args.splice(index, 1);
        index--;
      }

      return match;
    }); // Apply env-specific formatting (colors, etc.)

    createDebug.formatArgs.call(self, args);
    var logFn = self.log || createDebug.log;
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = createDebug.enabled(namespace);
  debug.useColors = createDebug.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;
  debug.extend = extend; // Debug.formatArgs = formatArgs;
  // debug.rawLog = rawLog;
  // env-specific initialization logic for debug instances

  if (typeof createDebug.init === 'function') {
    createDebug.init(debug);
  }

  createDebug.instances.push(debug);
  return debug;
}