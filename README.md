KGNU Stream Stats
=================

Shows stats for current kgnu, afterFM, and total stream listeners on a graph.
Endpoints: /all shows all, default "/" shows just total.

Endpoints
===============

/ = Graph of Listener totals for 7 days.

/all = Show lines for KGNU, AfterFM, and Total listeners. 

Notes
------------
MongoDB is served from Mongo Atlas. Update the connection string in .env in production.

Uses plotly.js for the charts, this is loaded client side in the html files.

-------------------

\ ゜o゜)ノ
