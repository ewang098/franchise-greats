import React, {useState} from 'react';
import Player from './Player';
import "./App.css";
import {ReactComponent as EastIcon} from './icons/NBAEastern.svg';
import {ReactComponent as WestIcon} from './icons/NBAWestern.svg';
import data from './data/franchiseGreats.csv';

const App = () =>{
  const api_key = process.env.REACT_APP_API_KEY;
  const search_engine_id = process.env.REACT_APP_SEARCH_ENGINE_ID;

  const [teamTitle, setTeamTitle] = useState(['The game is more than just points']);

  var home = {
    name:'See which players got the most games, field goals, rebounds, assists, steal, and blocks for their team!',
    accomplishments:[],
    picture:'https://fadeawayworld.net/wp-content/uploads/2020/08/118594159_741980979694685_5564752606458185455_n.jpg?x34613'
  }

  const [FG, setFG] = useState([home]);

  const [loading, setLoading] = useState(false);

  const eastTeams =['ATL','BOS','BKN','CHA','CHI','CLE','DET','IND',
                    'MIA','MIL','NYK','ORL','PHI','TOR','WAS'];
  const westTeams =['DAL','DEN','GSW','HOU','LAC','LAL','MEM','MIN',
                    'NOP','OKC','PHO','POR','SAC','SAS','UTA'];

  var allTeams = [];

  var xhr = new XMLHttpRequest();
  //this csv file is from the webscraper, added Team to first row of csv manually
  xhr.open("GET",data,false);
  xhr.send(null);

  var jsonObject = xhr.responseText.split(/\r?\n|\r/);

  const allTeamProps = jsonObject[0].split(',');

  for (var i = 1; i < jsonObject.length - 1; i++){
    var teamValue = jsonObject[i].split(',');
    var obj = {
      [allTeamProps[0]] : teamValue[0],
      [allTeamProps[1]] : teamValue[1],
      [allTeamProps[2]] : teamValue[2],
      [allTeamProps[3]] : teamValue[3],
      [allTeamProps[4]] : teamValue[4],
      [allTeamProps[5]] : teamValue[5],
      [allTeamProps[6]] : teamValue[6],
    }
    allTeams.push(obj);
  }

  function populatePlayerArray(teamAbv){
    setLoading(true);
    const playerArray = [];
    
    var teamIndex = allTeams.findIndex(allTeam => allTeam.Team === teamAbv);

    var teamObj = allTeams[teamIndex];

    let playerNames = Object.values(teamObj);
    playerNames = playerNames.filter(a => a !== teamAbv);

    let playerAcc = Object.keys(teamObj);
    playerAcc = playerAcc.filter(b => b !== 'Team');

    const unique = (value, index, self) => {
      return self.indexOf(value) === index
    }

    const uniquePlayers = playerNames.filter(unique);

    for(var uNum = 0; uNum < uniquePlayers.length; uNum++){
      playerArray.push({
        name: uniquePlayers[uNum],
        accomplishments: [],
        picture: null,
      });
      for(var aNum = 0; aNum < playerAcc.length; aNum++){
        if(uniquePlayers[uNum] === playerNames[aNum]){
          playerArray[uNum].accomplishments.push(playerAcc[aNum]);
        }
      }
    }
       
    const getImage = async () => {
      for (var i = 0; i < playerArray.length; i++){
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=${search_engine_id}&searchType=image&q=${playerArray[i].name}`);
        const data = await response.json();
        if(typeof(data.items) !== 'undefined'){
          playerArray[i].picture = await data.items[0].link;
        }
        else{
          playerArray[i].picture = 'https://media.npr.org/assets/img/2016/03/29/ap_090911089838_sq-3271237f28995f6530d9634ff27228cae88e3440-s800-c85.jpg';
        }
      }
      await setTeamTitle(teamAbv);
      await setFG(playerArray);
      await setLoading(false);
    }
    getImage();
  }

  if (loading) return(
    <div className="loadingScreen">
      <h1>Loading . . .</h1>
    </div>
  )

  return(
    <div className="App">
      <Navbar>
        <h1 className="navbar-header">Franchise Greats</h1>
        <NavItem icon={<EastIcon />}>
          <DropdownMenu list={eastTeams}></DropdownMenu>
        </NavItem>
        <NavItem icon={<WestIcon />}>
          <DropdownMenu list={westTeams}></DropdownMenu>
        </NavItem>
      </Navbar>
        <h1 className="franchise">{teamTitle}</h1>
        <div className="players">
          {FG.map(player => (
            <Player key={player.name} name={player.name} accomplishments={player.accomplishments} picture={player.picture}/>
          ))}
        </div>
    </div>
  )

  function Navbar(props){
    return(
      <nav className="navbar">
        <ul className="navbar-nav">{props.children}</ul>
      </nav>
    )
  }
  
  function NavItem(props){
  
    const [open, setOpen] = useState(false);
  
    return(
      <li className="nav-item">
        <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
          {props.icon}
        </a>
        {open && props.children}
      </li>
    );
  }
  
  function DropdownMenu(props){
  
    function DropdownItem(props){
      return(
        <a className="menu-item" onClick={() => populatePlayerArray(props.children)}>
          {props.children}
        </a>
      )
    }
  
    return(
    <div className="dropdown">
        {props.list.map(teamName =>(
          <DropdownItem>{teamName}</DropdownItem>
        ))}
      </div>
    )
  }
}

export default App;