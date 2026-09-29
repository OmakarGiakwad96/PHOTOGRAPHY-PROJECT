package com.photohub.repository;

import com.photohub.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByPhotographer_PhotographerIdAndIsDeletedFalse(Long photographerId);
}
