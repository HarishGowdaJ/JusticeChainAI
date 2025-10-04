// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CaseStorage {
    struct Hearing {
        uint256 date;
        string purpose;
        string notes;
    }

    struct Judgment {
        string verdict;
        string sentence;
        uint256 fine;
        string judgmentText;
        uint256 judgmentDate;
    }

    struct Case {
        string caseNumber;
        string status;
        Hearing[] hearings;
        Judgment judgment;
    }

    mapping(string => Case) private cases;

    event CaseCreated(string indexed caseNumber);
    event CaseStatusUpdated(string indexed caseNumber, string status);
    event HearingScheduled(string indexed caseNumber, uint256 date, string purpose);
    event JudgmentRecorded(string indexed caseNumber, string verdict, string sentence, uint256 fine);

    // Create a new case record
    function createCase(string memory caseNumber) public {
        require(bytes(cases[caseNumber].caseNumber).length == 0, "Case already exists");
        cases[caseNumber].caseNumber = caseNumber;
        cases[caseNumber].status = "filed";
        emit CaseCreated(caseNumber);
    }

    // Update the status of an existing case
    function updateCaseStatus(string memory caseNumber, string memory status) public {
        require(bytes(cases[caseNumber].caseNumber).length != 0, "Case not found");
        cases[caseNumber].status = status;
        emit CaseStatusUpdated(caseNumber, status);
    }

    // Schedule a hearing for the case
    function scheduleHearing(string memory caseNumber, uint256 date, string memory purpose, string memory notes) public {
        require(bytes(cases[caseNumber].caseNumber).length != 0, "Case not found");
        cases[caseNumber].hearings.push(Hearing(date, purpose, notes));
        emit HearingScheduled(caseNumber, date, purpose);
    }

    // Record the judgment for the case
    function recordJudgment(string memory caseNumber, string memory verdict, string memory sentence, uint256 fine, string memory judgmentText) public {
        require(bytes(cases[caseNumber].caseNumber).length != 0, "Case not found");
        cases[caseNumber].judgment = Judgment(verdict, sentence, fine, judgmentText, block.timestamp);
        cases[caseNumber].status = "judgment";
        emit JudgmentRecorded(caseNumber, verdict, sentence, fine);
    }

    // Get the full case details
    function getCase(string memory caseNumber) public view returns (
        string memory theCaseNumber,
        string memory status,
        Hearing[] memory hearings,
        Judgment memory judgment
    ) {
        require(bytes(cases[caseNumber].caseNumber).length != 0, "Case not found");
        Case storage c = cases[caseNumber];
        return (c.caseNumber, c.status, c.hearings, c.judgment);
    }
}
