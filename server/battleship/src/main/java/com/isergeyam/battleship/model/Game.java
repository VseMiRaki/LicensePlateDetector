package com.isergeyam.battleship.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.FetchType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.isergeyam.battleship.model.User;

/**
 * Game
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Game {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "winner_id")
  private User winner;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "loser_id")
  private User loser;

  public Game(User winner, User loser) {
    this.winner = winner;
    this.loser = loser;
  }
}