import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="main">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}