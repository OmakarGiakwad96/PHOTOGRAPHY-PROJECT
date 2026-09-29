package com.photohub.repository;

import com.photohub.model.Photographer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotographerRepository extends JpaRepository<Photographer, Long> {
    Optional<Photographer> findByEmail(String email);
    List<Photographer> findByLocationContainingIgnoreCase(String location);
    List<Photographer> findBySpecialtiesContainingIgnoreCase(String category);
}
