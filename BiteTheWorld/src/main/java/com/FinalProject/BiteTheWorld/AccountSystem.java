package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

class AccountSystem {
    private List<Account> accounts = new ArrayList<>();

    public UUID login(String email, String password) {
        throw new UnsupportedOperationException();
    }

    public boolean register(String name, String email, String password) {
        throw new UnsupportedOperationException();
    }

    public boolean requestPasswordReset(String email) {
        throw new UnsupportedOperationException();
    }

    public boolean resetPassword(UUID userId, String newPassword) {
        throw new UnsupportedOperationException();
    }

    public boolean changeEmail(UUID userId, String newEmail) {
        throw new UnsupportedOperationException();
    }

    public boolean deleteAccount(UUID userId) {
        throw new UnsupportedOperationException();
    }
}