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

/* Repl running moush */
MouseApp.Repl = function(element, options) {
  this.element = $(element);
  this.setOptions(options);
  if ( this.options.init ) {
      this.init = this.options.init;
  }
  this.initWindow();
  this.setup();
  this.replInit = false;
};

$.extend(MouseApp.Repl.prototype, MouseApp.Terminal.prototype, {
    cmdToQuery: function(cmd) {
        return "cmd=" + escape(cmd.replace(/&lt;/g, '<').replace(/&gt;/g, '>').
            replace(/&amp;/g, '&').replace(/\r?\n/g, "\n")).replace(/\+/g, "%2B");
    },

    fireOffCmd: function(cmd, func) {
      var repl = this;
        if (!this.replInit)
        {
          $.ajax({url: this.options.replUrl + "?" + this.cmdToQuery("!INIT!REPL!"), type: "GET",
            complete: (function(r) { repl.replInit = true; repl.fireOffCmd(cmd, func); })});
        }
        else
        {
          $.ajax({url: this.options.replUrl + "?" + this.cmdToQuery(cmd), type: "GET", 
            complete: func});
        }
    },

    reply: function(str) {
        var raw = str.replace(/\033\[(\d);(\d+)m/g, '');
        if (str != "..") {
            if ( str[str.length - 1] != "\n" ) {
                str += "\n";
            }
            js_payload = /\033\[1;JSm(.*)\033\[m/;
            js_in = str.match(js_payload);
            if (js_in) {
                try {
                    js_in = eval(js_in[1]);
                } catch (e) {}
                str = str.replace(js_payload, '');
            }
            var pr_re = new RegExp("(^|\\n)=>");
            if ( str.match( pr_re ) ) {
              str = str.replace(new RegExp("(^|\\n)=>"), "$1\033[1;34m=>\033[m");
            } else {
              str = str.replace(new RegExp("(^|\\n)= (.+?) ="), "$1\033[1;33m$2\033[m");
            }
            this.write(str);
            this.prompt();
        } else {
            this.prompt("\033[1;32m..\033[m", true);
        }
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
                this.fireOffCmd(cmd, (function(r) { term.reply(r.responseText ? r.responseText : ''); }));
            }
        } else {
            this.prompt();
        }
    }
});
