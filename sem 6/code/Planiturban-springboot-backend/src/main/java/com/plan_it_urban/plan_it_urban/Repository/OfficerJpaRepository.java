package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficerJpaRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByOfficerEmail(String email);
}
