package com.isergeyam.battleship.payload;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * StatsResponse
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StatsResponse {
  private Long winrate;
  private ArrayList<String> winners;
  private ArrayList<String> losers;
}