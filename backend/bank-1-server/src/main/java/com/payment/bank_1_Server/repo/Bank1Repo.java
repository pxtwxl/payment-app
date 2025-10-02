package com.payment.bank_1_Server.repo;

import com.payment.bank_1_Server.model.Bank1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Bank1Repo extends JpaRepository<Bank1,Long> {
}
