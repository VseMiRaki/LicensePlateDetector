package com.isergeyam.battleship.service;

import org.springframework.data.util.Pair;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * HitResult
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HitResult {
  private boolean hit;
  private boolean sunk;
  Pair<Integer, Integer> coords;
}