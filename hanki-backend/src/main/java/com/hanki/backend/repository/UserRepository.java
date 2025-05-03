package com.hanki.backend.repository;

import com.hanki.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);

    User findByEmail(String email);

    User findByUsernameAndEmail(String username, String email);

    User findByEmailAndPassword(String email, String password);
}
