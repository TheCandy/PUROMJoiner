// Disclaimer for using en_thesaurus.json extracted from WordNet database

// License and Commercial Use of WordNet
// WordNet® is unencumbered, and may be used in commercial applications in accordance
// with the following license agreement. An attorney representing the commercial interest should review this WordNet license with respect to the intended use.

// WordNet License
// This license is available as the file LICENSE in any downloaded version of WordNet.

// WordNet 3.0 license: (Download)

// WordNet Release 3.0 This software and database is being provided to you, the LICENSEE,
// by Princeton University under the following license. By obtaining, using and/or copying this software and database,
// you agree that you have read, understood, and will comply with these terms and conditions.:
// Permission to use, copy, modify and distribute this software and database and its documentation for any purpose
// and without fee or royalty is hereby granted, provided that you agree to comply with the following copyright notice and statements,
// including the disclaimer, and that the same appear on ALL copies of the software, database and documentation, 
// including modifications that you make for internal use or for distribution.
// WordNet 3.0 Copyright 2006 by Princeton University. All rights reserved.

// THIS SOFTWARE AND DATABASE IS PROVIDED "AS IS" AND PRINCETON UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES,
// EXPRESS OR IMPLIED. BY WAY OF EXAMPLE, BUT NOT LIMITATION, PRINCETON UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES OF MERCHANT-
// ABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE LICENSED SOFTWARE, DATABASE OR DOCUMENTATION WILL NOT INFRINGE
// ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.
// The name of Princeton University or Princeton may not be used in advertising or publicity pertaining to distribution of the software and/or database.
// Title to copyright in this software, database and any associated documentation shall at all times remain with Princeton University and LICENSEE agrees to preserve same.

async function GetThesaurus() {
    let response = await fetch("https://raw.githubusercontent.com/TheCandy/PUROMJoiner/main/en_thesaurus.json");
    if (response.status != 200) {
        throw new Error("Server Error");
    }
    let text_data = await response.text();
    var ssSynonyms = JSON.parse(text_data)
    return ssSynonyms
}