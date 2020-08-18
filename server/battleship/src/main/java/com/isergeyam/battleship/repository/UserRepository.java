package com.isergeyam.battleship.repository;

import java.util.List;
import java.util.Optional;

import com.isergeyam.battleship.model.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 * UserRepository
 */
public interface UserRepository extends CrudRepository<User, Integer> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUsernameOrEmail(String username, String email);

  Optional<User> findByUsername(String username);

  Optional<User> findById(Integer id);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  Iterable<User> findAll();

  @Query(value = "SELECT username FROM  user ORDER BY 100 * (user.games_won / user.games_played) DESC LIMIT 10",  nativeQuery = true)
  List<String> findTopPlayers();
  
  @Query(value = "SELECT 100 * (games_won / games_played) FROM  user ORDER BY 100 * (user.games_won / user.games_played) DESC LIMIT 10", nativeQuery = true)
  List<Integer> findTopResults();

  @Query(value= "SELECT 100 * (games_won / games_played) FROM user WHERE user.id = :id", nativeQuery = true)
  Optional<Long> getUserWinrate(@Param("id") Integer id);
}