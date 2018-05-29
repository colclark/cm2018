import * as GAMEDATAS from './data.json'

class GameHelper {
   
    constructor () {
        this.groupBets = {}
    }
    
    setGroupBet (groupKey, countryId) {
        let groupBets = this.getGroupBets(groupKey)
        let index = groupBets.indexOf(countryId)
        if (index === -1) {
            groupBets.push(countryId)
        } else {
            groupBets.splice(index, 1)
        }
    }

    getImagePath (id) {
        return 'assets/images/' + id + '.gif';
    }
    getCountry (id) {
        return GAMEDATAS.codePays[id]
    }

    getGroup (id) {
        return GAMEDATAS.groupes[id]
    }
    getGroups () {
        return GAMEDATAS.groupes
    }

    getGroupBets (id) {
        let bets = this.groupBets[id]
        if (!bets) {
            bets = this.groupBets[id] = []
        }
        return bets
    }
}


// Singleton
const GameHelperSingleton = new GameHelper();
export default GameHelperSingleton;