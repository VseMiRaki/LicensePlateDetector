package com.isergeyam.battleship.repository;

import java.util.ArrayList;
import java.util.List;

import com.isergeyam.battleship.model.Game;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * UserRepository
 */
@Repository
public interface GameRepository extends CrudRepository<Game, Integer> {
  @Query(value = "select winner_id, loser_id from game where (game.winner_id = :user_id) or (game.loser_id = :user_id)", nativeQuery = true)
  List<ArrayList<Integer>> findLastGames(@Param("user_id") Integer user_id);
}
