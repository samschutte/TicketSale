//SPDX-License-Identifier: GBD-10

pragma solidity ^0.8.17;

contract ticketSale {

  address public owner;
  uint public totalTickets;
  uint public ticketPrice;

  ticket[] public TicketList;

  mapping(address => uint) public ticketOwners;
  mapping(address => address) public swaplist;

  struct ticket {
        uint ticketID;
        bool status;
        address buyer;
  }

  constructor(uint numTickets, uint price) public {
      owner = msg.sender;
      totalTickets = numTickets;
      ticketPrice = price;

  }

  function buyTicket(uint ticketId) public payable returns(string memory, bool, bytes memory) {
      require(getTicketOf(msg.sender) == 0);              //require buyer hasn't bought ticket
      require(TicketList[ticketId].status == false);      //require ticket hasn't been bought
      require(msg.value >= ticketPrice);                  //require pay amount enough to purchase
      require(ticketId >= 0 && ticketId <= totalTickets); //requested ticket must be available

      string memory message;
      bool success;
      bytes memory data;

      ticketOwners[msg.sender] = ticketId;     // mark owner of this ticket as sender
      TicketList[ticketId].status = true;      // mark status of this ticket as purchased
      TicketList[ticketId].buyer = msg.sender; // set ticket buyer as sender
      (success, data) = owner.call{value: ticketPrice}("");
      message = "Your purchase is successful!";

      return(message,success,data);

  }

  function getTicketOf(address person) public view returns (uint) {
      return ticketOwners[person];
  }

  function offerSwap(address partner) public {
      require(getTicketOf(msg.sender) != 0);  // confirm sender owns ticket
      swaplist[partner] = msg.sender;         // map partner to sender
  }

  function acceptSwap(address partner) public {
      require(ticketOwners[msg.sender] != 0);     // sender owns ticket
      require(ticketOwners[partner] != 0);        // partner owns ticket
      require(swaplist[msg.sender] == partner);   // check offer was made

      uint senderID = getTicketOf(msg.sender);    // ticketID of sender
      uint partnerID = getTicketOf(partner);      // ticketID of partner
      ticketOwners[partner] = senderID;
      ticketOwners[msg.sender] = partnerID;
  }

}
