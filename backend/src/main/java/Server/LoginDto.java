package Server;

public class LoginDto {

    public final String username;
    public final String password;

    public LoginDto(String username, String password, String accessType) {
        this.username = username;
        this.password = password;
    }

}
