package com.payment.bank_1_Server.service;

import com.payment.bank_1_Server.model.Bank1;
import com.payment.bank_1_Server.model.Bank2;
import com.payment.bank_1_Server.model.User;
import com.payment.bank_1_Server.repo.Bank1Repo;
import com.payment.bank_1_Server.repo.Bank2Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class Bank2Service {

    @Autowired
    private Bank2Repo repo;

    public ResponseEntity<String> saveUserAccount(User user) {
        try{
            Bank2 bank = new Bank2();
            if(bank.getBankName() != user.getBankName())
                throw new RuntimeException("Bank MisMatch");

            bank.setCustomerMail(user.getEmail());
            bank.setCustomerPassword(user.getPassword());
            bank.setCustomerAddress(user.getAddress());
            bank.setCustomerName(user.getName());
            bank.setCustomerBalance(user.getBalance());
            bank.setCustomerPhone(user.getPhone());
            bank.setCustomerPin(user.getPayPin());
            bank.setCustomerUpiId(user.getUpiId());
            bank.setCustomerAccountNo(user.getBankAccount());
            bank.setCustomerIfsc(user.getBankIfsc());

            repo.save(bank);
            return new ResponseEntity<>("Account Saved Success",HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>("Account Could not be found", HttpStatus.BAD_REQUEST);
    }
}
