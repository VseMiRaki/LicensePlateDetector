package com.isergeyam.battleship.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.NaturalId;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * User
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer Id;

  @NaturalId
  @NotBlank
  private String username;

  @NaturalId
  @NotBlank
  @Email
  private String email;

  @NotBlank
  private String password;

  private Long gamesPlayed = Long.valueOf(0);

  private Long gamesWon = Long.valueOf(0);

//   @OneToMany(fetch = FetchType.LAZY, mappedBy = "winner")
//   private Set<Game> won_games;

//   @OneToMany(fetch = FetchType.LAZY, mappedBy = "loser")
//   private Set<Game> lost_games;

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}