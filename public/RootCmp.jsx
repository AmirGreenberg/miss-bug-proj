const Router = ReactRouterDOM.BrowserRouter
const { Routes, Route, Navigate } = ReactRouterDOM

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { Home } from './pages/Home.jsx'
import { UserDetails } from './pages/UserDetails.jsx'

export function App() {
    return (
        <Router>
            <div>
                <AppHeader />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/bug" element={<BugIndex />} />
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                        <Route path="/user/:userId" element={<UserDetails />} />
                    </Routes>
                </main>
                <AppFooter />
            </div>
        </Router>
    )
}
