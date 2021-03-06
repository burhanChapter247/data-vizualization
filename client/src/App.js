import ProductChart from "./component/products-chart";
import SalesVariation from "./component/sales-variation";
import OrdersVariation from "./component/orders-variation";
import Dashboard from "./component/dashboard";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
// Create a client
const queryClient = new QueryClient(); // Instance of QueryClient
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/product">Product</Link>
              </li>
              <li>
                <Link to="/sale">Sale</Link>
              </li>
              <li>
                <Link to="/order">Order</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/product">
              <ProductChart />
            </Route>
            <Route path="/sale">
              <SalesVariation />
            </Route>
            <Route path="/order">
              <OrdersVariation />
            </Route>
            <Route path="/">
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </Router>
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  );
}

export default App;
