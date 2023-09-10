const through = require('through2');

module.exports = {
  cliOptions: {
    src: './src/index.ts',
    port: 8080,
  },
  bundlerCustomizer: (bundler) => {
    bundler.transform(function (a) {
      let data = '';
      let fileName_array = a.split('.')
      if(fileName_array[fileName_array.length-1] === 'json'){
        console.log("loading json");
        return through(
          function (buffer, _encoding, callback) {
            data += buffer;
            callback();
          },
          function (callback) {
            this.push(data);
            callback();
          },
        );
      }
      return through(
        function (buffer, _encoding, callback) {
          data += buffer;
          callback();
        },
        function (callback) {
          
          this.push("globalThis.Buffer = require('buffer/').Buffer;");
          this.push(data);
          callback();
        },
      );
    });
  },
};
