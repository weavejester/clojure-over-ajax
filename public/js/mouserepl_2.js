//
// Copyright (c) 2008 why the lucky stiff
// 
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
// ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
// TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
// SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
// OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Modified by James Reeves to support a Clojure REPL.
// Original Ruby version at: http://tryruby.hobix.com/

MouseApp.Repl = function(element, options) {
  this.element = $(element);
  this.setOptions(options);

  if (this.options.init) {
      this.init = this.options.init;
  }
  this.initWindow();
  this.setup();
};

$.extend(MouseApp.Repl.prototype, MouseApp.Terminal.prototype, {
    fireOffCmd: function(cmd, func) {
        $.ajax({
            type: "POST",
            url:  this.options.replUrl,
            data: {cmd: cmd},
            complete: func
        });
    },

    reply: function(str) {
        this.write(str + "\n");
        this.prompt();
    },

    onKeyCtrld: function() {
        this.clearCommand();
        this.puts("reset");
        this.onKeyEnter();
    },

    onKeyEnter: function() {
        this.typingOff();
        var cmd = this.getCommand();
        if (cmd) {
            this.history[this.historyNum] = cmd;
            this.backupNum = ++this.historyNum;
        }
        this.commandNum++;
        this.advanceLine();
        if (cmd) {
            if ( cmd == "clear" ) {
                this.clear();
                this.prompt();
            } else {
                var term = this;
                this.fireOffCmd(cmd, function(r) {
                    term.reply(r.responseText ? r.responseText : '');
                });
            }
        } else {
            this.prompt();
        }
    }
});
