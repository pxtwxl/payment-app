package com.payment.bank_1_Server.repo;

import com.payment.bank_1_Server.model.Bank1;
import com.payment.bank_1_Server.model.Bank2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Bank2Repo extends JpaRepository<Bank2,Long> {
    Bank2 findByCustomerUpiId(String upi);
}
