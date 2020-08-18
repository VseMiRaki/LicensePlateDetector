package com.isergeyam.battleship.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

/**
 * StatsResponse
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Top10PlayerResponse {
  private ArrayList<String> top_players_usernames; 
  private ArrayList<Integer> top_results;
}