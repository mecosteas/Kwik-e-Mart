package Server;

import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.conversions.Bson;
import static com.mongodb.client.model.Filters.eq;

import java.awt.event.ItemListener;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static spark.Spark.*;

public class Server {

    public static void main(String[] args){
        // open connection
        MongoClient mongoClient = new MongoClient("localhost", 27017);
        // get ref to database
        MongoDatabase db = mongoClient.getDatabase("MyDatabase");
        // get ref to collections
        MongoCollection<Document> userCollection = db.getCollection("Users");
        MongoCollection<Document> itemCollection = db.getCollection("Items");
        MongoCollection<Document> transactionCollection = db.getCollection("Transactions");

        // hardcode two users: The manager and the customer
        if(userCollection.countDocuments() != 2){ // for this project, DB will only hold 2 users
            userCollection.insertOne(new Document("username", "sebastian")
                    .append("password", "123")
                    .append("isManager", true));
            userCollection.insertOne(new Document("username", "roberto")
                    .append("password", "abc")
                    .append("isManager", false));
        }

        Gson gson = new Gson();

        port(4000);
        post("/api/authenticate", (req, res) -> {
            String bodyString = req.body();
            LoginDto loginDto = gson.fromJson(bodyString, LoginDto.class);

            List<Document> potentialUser = userCollection.find(new Document("username", loginDto.username))
                    .into(new ArrayList<>());
            // if user is not found, return false, not found
            if(potentialUser.size() != 1){
                LoginResponseDto responseDto =
                        new LoginResponseDto(false, "User not found", false);
                return gson.toJson(responseDto);
            }
            Document userDocument = potentialUser.get(0); // if found, should be only one in list
            if(!userDocument.getString("password").equals(loginDto.password)){ // if password is wrong
                LoginResponseDto responseDto =
                        new LoginResponseDto(false, "Password is incorrect", false);
                return gson.toJson(responseDto);
            }
            boolean isManager = userDocument.getBoolean("isManager"); // get access type (manager or customer)
            LoginResponseDto responseDto =
                    new LoginResponseDto(true, null, isManager);
            return gson.toJson(responseDto);
        });

        post("/api/addItem", (req, res) ->{
            //This function will add an item to the shop
            String bodyString = req.body();
            ItemDto itemDto = gson.fromJson(bodyString, ItemDto.class);

            List<Document> potentialItem = itemCollection.find(new Document("Item", itemDto.itemName))
                    .into(new ArrayList<>());
            //if item is already in database
            if(potentialItem.size() > 0){
                ItemResponseDto responseDto =
                        new ItemResponseDto(false, "Item is already in the store");
                return gson.toJson(responseDto);
            }
            //else add item to database
            Document newItem = new Document("Item", itemDto.itemName);
            newItem.append("Price", itemDto.itemPrice);
            itemCollection.insertOne(newItem);
            ItemResponseDto responseDto =
                    new ItemResponseDto(true, null);
            return gson.toJson(responseDto);
        });

        get("/api/getAllItems", (req, res) -> {
            //this is a method to fetch all the items that are in the shop
            MongoCollection<Document> itemsCollection = db.getCollection("Items");
            List<String> items = itemsCollection.find().into(new ArrayList<>())
                    .stream()
                    .map(document -> {
                        return document.getString("Item") + " : $" + document.getString("Price");
                    })
                    .collect(Collectors.toList());
            ItemsListDto allItems = new ItemsListDto(items);
            return gson.toJson(allItems);
        });

        post("api/removeItem", (req, res) ->{
            //this function will remove an item from the shop
            String bodyString = req.body();
            Bson filter = eq("Item", bodyString);
            itemCollection.deleteOne(filter);

            ItemResponseDto responseDto =
                    new ItemResponseDto(true, null);
            return gson.toJson(responseDto);
        });

        //Grabs a single item from the DB
        post("api/getItem", (req, res) ->{
            String bodyString = req.body();
            MongoCollection<Document> itemsCollection  = db.getCollection("Items");
            Document fetched_item = itemsCollection.find(eq("Item", bodyString)).first();
            ItemDto theItem = new ItemDto(fetched_item.getString("Item"), fetched_item.getString("Price"));
            return gson.toJson(theItem);
        });

        //Creates a transaction and stores in in DB
        post("api/createTransaction", (req, res) ->{
            Document newTransaction = new Document("Transaction", req.body());
            transactionCollection.insertOne(newTransaction);
            ItemResponseDto responseDto =
                    new ItemResponseDto(true, null);
            return gson.toJson(responseDto);
        });

        //Gets all transactions
        get("api/getAllTransactions", (req, res) ->{
            MongoCollection<Document> transactionsCollection = db.getCollection("Transactions");
            List<String> transactions = transactionsCollection.find().into(new ArrayList<>())
                    .stream()
                    .map(document -> {
                        return document.getString("Transaction");
                    })
                    .collect(Collectors.toList());
            ItemsListDto allTransactions = new ItemsListDto(transactions);
            return gson.toJson(allTransactions);
        });
    }
}
