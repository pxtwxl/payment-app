package com.payment.user_service.service;

import com.payment.user_service.model.DTO.UserForm;
import com.payment.user_service.model.User;
import com.payment.user_service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    public ResponseEntity<String> createUser(User user) {
        try {
            user.setPassword(encoder.encode(user.getPassword()));
            repo.save(user);
            return new ResponseEntity<>("User Saved Successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("User Saving Failed",HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> createPin(String email, int pin) {
        try {
            User user = repo.findByEmail(email);
            if(user != null && user.getEmail() != null && user.getEmail() != "") {
                user.setPayPin(pin);
                repo.save(user);
                return new ResponseEntity<>("Pin Created Successfully",HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>("Pin Creation Failed",HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<Integer> fetchPin(String email) {
        try {
            User user = repo.findByEmail(email);
            int pinRes;
            if(user.getEmail() != null && user.getEmail() != "")
                pinRes = user.getPayPin();
            else
                throw new RuntimeException();

            return new ResponseEntity<>(pinRes,HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(0,HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> saveUserForm(UserForm user) {
        try {
            User userRes = repo.findByEmail(user.getEmail());
            userRes.setName(user.getName());
            userRes.setPhone(user.getPhone());
            userRes.setAddress(user.getAddress());
            userRes.setBankAccount(user.getBankAccount());
            userRes.setBankName(user.getBankName());
            userRes.setBankIfsc(user.getBankIfsc());
            userRes.setUpiId(user.getUpiId());
            userRes.setBalance(100000.00);

            repo.save(userRes);
            return new ResponseEntity<>("User Saved Success",HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("User Saved Failed",HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> fetchUPI(String email) {
        try {
            User user = repo.findByEmail(email);
            if(user.getUpiId() == null || user.getUpiId() == "")
                throw new RuntimeException("UPI ID not present");

            return new ResponseEntity<>(user.getUpiId(),HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("No UPI ID",HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<Double> fetchBalance(String email) {
        try {
            User user = repo.findByEmail(email);
            if(user == null)
                throw new RuntimeException("user not found");

            return new ResponseEntity<>(user.getBalance(),HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(0.00,HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<Boolean> getValidation(String upiId) {
        try {
            User payee = repo.findByUpiId(upiId);
            if(payee == null)
                throw new RuntimeException("user not found");

            return new ResponseEntity<>(true,HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(false,HttpStatus.BAD_REQUEST);
    }
}
