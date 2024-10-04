package com.snack.backend_v1.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.snack.backend_v1.model.Receipt;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    List<Receipt> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
