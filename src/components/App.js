import React from 'react'

import GameHelper from '../data/GameHelper'
import TopBanner from './TopBanner'
import LoginPage from './LoginPage'
import BetPage from './BetPage'
import ResultsPage from './ResultsPage'


import '../../assets/css/app.scss'

export default class App extends React.Component {

    constructor (props) {
        super(props)

        const isLogged = GameHelper.isLogged()
        this.state = { 
            isLogged, 
            page: null
        }
    }

    render () {
        return (
            <div>
                <TopBanner 
                    userName={ GameHelper.getUserName() } 
                    onEnterUserName={ () => this.setState({ page: App.PAGES.LOGIN })}
                    onShowResults={ () => this.setState({ page: App.PAGES.RESULTS })}
                />

                { this.renderPage() }
            </div>
        )
    }

    renderPage () {

        switch (this.state.page || this.getDefaultPage()) {

            case App.PAGES.LOGIN:
                return <LoginPage 
                    userName={ GameHelper.getUserName() } 
                    onLogin={ (userName) => this.onLogin(userName) }
                />

            case App.PAGES.BETS:
                return <BetPage/>
            
            case App.PAGES.RESULTS:
                return <ResultsPage/>
            
            default:
                return null
        }
    }

    onLogin (userName) {
        GameHelper.logon(userName)
            .then(result => this.setState({ isLogged: true, page: null }))
            .catch(() => alert('Invalid user \'' + userName + '\''))
    }

    getDefaultPage () {
        return GameHelper.isSubmitAllowed() ? App.PAGES.BETS : App.PAGES.RESULTS
    }
}

App.PAGES = { 'LOGIN': 'login', RESULTS: 'results', BETS: 'Bets' }

    