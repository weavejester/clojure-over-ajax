(ns ajax-repl
  (:use compojure)
  (:use [clojure.main :only (repl-exception)]))

(def repl-scripts
  (include-js "/js/jquery.js"
              "/js/mouseapp_2.js"
              "/js/mouserepl_2.js"
              "/js/repl.js"))

(def try-ruby
  (link-to "http://tryruby.hobix.com/" "Try Ruby!"))

(def credits
  [:p "With javascript based on _why's: " try-ruby])

(defn show-repl
  "HTML for the REPL index page"
  []
  (html
    [:html
      [:head
        [:title "Clojure REPL"]
        (include-css "css/site.css")
        repl-scripts]
      [:body
        [:h1 "Clojure REPL"]
        [:div#terminal
          [:div#repl]]
        credits]]))

(defn repl-eval
  "Evaluate an expression, but catch and print errors and set *1 etc. vars."
  [expr]
  (try
    (let [value (eval expr)]
      (print value)
      (set! *3 *2)
      (set! *2 *1)
      (set! *1 value))
    (catch Throwable e
      (println (repl-exception e))
      (set! *e e))))

(defmacro capture-vars
  "Given a list of var names, return a map of name/value pairs."
  [& names]
  (reduce
    (fn [m n] (assoc m `'~n n))
    {}
    names))

(defn eval-with-session
  "Evaluate a command, keeping useful REPL state in the session."
  [session expr]
  (binding [*ns* *ns*
            *1   nil
            *2   nil
            *3   nil
            *e   nil]
    (in-ns (@session :ns 'user))
    (doseq [[name value] (@session :vars)]
      (var-set (eval `(var ~name)) value))
    (repl-eval expr)
    (dosync
      (alter session merge
         {:ns   (symbol (str *ns*))
          :vars (capture-vars *e *1 *2 *3)}))))

(defn eval-repl-cmd
  "Evaluate a command and return the result."
  [session cmd]
  (with-out-str
    (eval-with-session session (read-string cmd))))

(defservlet repl-servlet
  (GET "/"
    (show-repl))
  (POST "/repl"
    (eval-repl-cmd session (params :cmd)))
  (GET "/*"
    (or (serve-file (route :*))
        :next))
  (ANY "*"
    (page-not-found)))
