package com.payment.bank_1_Server.service;

import com.payment.bank_1_Server.model.Bank1;
import com.payment.bank_1_Server.model.User;
import com.payment.bank_1_Server.repo.Bank1Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class Bank1Service {

    @Autowired
    private Bank1Repo repo;

    public ResponseEntity<String> saveUserAccount(User user) {
        try{
            Bank1 bank1 = new Bank1();
            if(bank1.getBankName() != user.getBankName())
                throw new RuntimeException("Bank MisMatch");

            bank1.setCustomerMail(user.getEmail());
            bank1.setCustomerPassword(user.getPassword());
            bank1.setCustomerAddress(user.getAddress());
            bank1.setCustomerName(user.getName());
            bank1.setCustomerBalance(user.getBalance());
            bank1.setCustomerPhone(user.getPhone());
            bank1.setCustomerPin(user.getPayPin());
            bank1.setCustomerUpiId(user.getUpiId());
            bank1.setCustomerAccountNo(user.getBankAccount());
            bank1.setCustomerIfsc(user.getBankIfsc());

            repo.save(bank1);
            return new ResponseEntity<>("Account Saved Success",HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>("Account Could not be found", HttpStatus.BAD_REQUEST);
    }
}
