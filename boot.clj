(use 'ajax-repl)
(use 'compojure.server.jetty)

(run-server {:port 8080}
  "/*" repl-servlet)
