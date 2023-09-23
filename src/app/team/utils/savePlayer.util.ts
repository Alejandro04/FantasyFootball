import { Position, TeamLimits } from "../enums/enums";
import { Player } from "../interfaces/player.interface";
import { playerActions } from "../interfaces/playerAction.interface";
import { TeamService } from "../services/team.service";

export class UtilSavePlayer {
  quantityPlayers: number = 0;
  msgValidation: string = "";
  playerValidate: boolean = false;
  savedPlayer: boolean = false;
  msgHasPlayer: string = "";
      
  constructor(
    public teamService: TeamService
  ) { }

  savePlayer(playerData:Player): any {
    const localStorageData = localStorage.getItem('team');
    let existingData = [];
    let hasPlayer: boolean = false;
    let newData = playerData;

    if (localStorageData) {
      existingData = JSON.parse(localStorageData);
      hasPlayer = existingData.find((player: Player) => player.id === playerData.id);
      this.quantityPlayers = existingData.length;
    }

    if (existingData.length > 0 && !hasPlayer) {
      const getMaxPlayerForTeam = this.getMaxPlayerForTeam(existingData, newData.teamID, newData.position);

      if (existingData.length > 16) {
        this.msgValidation = "máximo 16 players por equipo"
        return
      }

      if (!getMaxPlayerForTeam.saveMoreIDPlayers ||
        !getMaxPlayerForTeam.saveMoreAttacker ||
        !getMaxPlayerForTeam.saveMoreDefenders ||
        !getMaxPlayerForTeam.saveMoreGoalkeeper ||
        !getMaxPlayerForTeam.saveMoreMidfielder) {
        this.msgValidation = "No puede guardar este jugador"
        this.playerValidate = true;
        return
      }

      if (Array.isArray(existingData)) {
        this.teamService.addPlayer(newData);
        existingData.push(newData);
        localStorage.setItem('team', JSON.stringify(existingData));
        this.savedPlayer = true;
        return
      }

    } else {
      if (hasPlayer) {
        this.playerValidate = true;
        this.msgHasPlayer = "No podemos fichar dos veces al mismo jugador";
        return
      }

      this.teamService.addPlayer(newData);
      localStorage.setItem('team', JSON.stringify([newData]));
      this.savedPlayer = true;
    }
  }

  getMaxPlayerForTeam(existingData: Player[], teamID: number, position: string) {
    let teamsIDs: number[] = this.getTeamsID(existingData)
    let positions: string[] = this.getTeamPositions(existingData);
    let fullTeamsIDs: any[] = [];
    let fullTeamPositions: any[] = [];
    let msgCountValidation: string = "";
    let msgPositionValidation: string = "";


    const countTeamIDs = teamsIDs.reduce((count: any, value) => {
      count[value] = (count[value] || 0) + 1;
      return count;
    }, {});

    const teamPositions = positions.reduce((count: any, value) => {
      count[value] = (count[value] || 0) + 1;
      return count;
    }, {});

    for (const value in countTeamIDs) {
      if (countTeamIDs.hasOwnProperty(value)) {
        if (countTeamIDs[value] >= TeamLimits.maxPlayerForTeam) {
          if (parseInt(value) === teamID) {
            msgCountValidation = "No puede guardar más jugadores de este equipo"
            fullTeamsIDs.push(value)
            playerActions.saveMoreIDPlayers = false;
          } else {
            playerActions.saveMoreIDPlayers = true;
          }
        }
      }
    }

    if (position === Position.Defender) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Defender] >= TeamLimits.maxDefendersForTeam &&
            value === position) {
            msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreDefenders = false;
          } else {
            playerActions.saveMoreDefenders = true;
          }
        }
      }
    }

    if (position === Position.Midfielder) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Midfielder] >= TeamLimits.maxMidfieldersForTeam &&
            value === position) {
            msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreMidfielder = false;
          } else {
            playerActions.saveMoreMidfielder = true;
          }
        }
      }
    }

    if (position === Position.Goalkeeper) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Goalkeeper] >= TeamLimits.maxGoalkeepersForTeam &&
            value === position) {
            msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreGoalkeeper = false;
          } else {
            playerActions.saveMoreGoalkeeper = true;
          }
        }
      }
    }

    if (position === Position.Attacker) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Attacker] >= TeamLimits.maxAttackersForTeam) {
            msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreAttacker = false;
          } else {
            playerActions.saveMoreAttacker = true;
          }
        }
      }
    }

    const saveMoreAttacker = playerActions.saveMoreAttacker;
    const saveMoreDefenders = playerActions.saveMoreDefenders;
    const saveMoreMidfielder = playerActions.saveMoreMidfielder;
    const saveMoreGoalkeeper = playerActions.saveMoreGoalkeeper;
    const saveMoreIDPlayers = playerActions.saveMoreIDPlayers;

    return {
      saveMoreIDPlayers,
      fullTeamsIDs,
      saveMoreDefenders,
      saveMoreMidfielder,
      saveMoreGoalkeeper,
      saveMoreAttacker,
      fullTeamPositions,
      msgCountValidation,
      msgPositionValidation
    }
  }

  getTeamsID(existingData: Player[]) {
    let teamsIDs: number[] = [];
    teamsIDs = existingData.map((item: Player) => item.teamID);

    return teamsIDs;
  }

  getTeamPositions(existingData: Player[]) {
    let positions: string[] = [];
    positions = existingData.map((item: Player) => item.position);

    return positions;
  }
}