
/**
 * Original Code Written by Brandon J. Rosales
 * Do not move or remove or edit this comment
 * This is a CSV editor made for the class portion for our project in 473.
 */

import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.filechooser.FileNameExtensionFilter;

public class FileEditor extends JFrame {
	private static final long serialVersionUID = 1L;

	public static void main(String[] args) {
		JFileChooser fc = new JFileChooser();
		FileNameExtensionFilter filter = new FileNameExtensionFilter("TXT and CSV files", "csv", "txt");
		fc.setFileFilter(filter);

		//Builds a temp frame so we can display the file chooser
		JFrame tempFrame = new JFrame();
		tempFrame.setSize(10, 10);
		tempFrame.setDefaultCloseOperation(EXIT_ON_CLOSE);
		tempFrame.setVisible(true);
		int returnVal = fc.showOpenDialog(tempFrame);
		tempFrame.dispose();
		
		if (returnVal == JFileChooser.APPROVE_OPTION) {
//			new FileEditor(new File("str320_data.csv.txt"));
			new FileEditor(new File(fc.getSelectedFile().getAbsolutePath()));
		}

	}

	// CORRECT FORMAT FOR 2 LINES IN CSV
	// COSC 110-003,Problem Solving & Structured Programming,09:30AM - 10:45AM,R
	// COSC 310-001,Data Structures and Algorithms,10:10AM - 11:00AM,MW
	File inputFile;
	ArrayList<Class> classList;

	int width = 800;
	int height = 400;

	Color backgroundColor = Color.decode("#708090");
	Color generalFontColor = Color.decode("#990000");

	GridLayout gl = new GridLayout(0, 2);

	JPanel leftPanel;
	JPanel rightPanel;

	JPanel leftScrollPanel;

	String[] ampm = { "AM", "PM" };
	JLabel rightTitleLabel;
	JLabel rightTimeLabel;
	JTextField rightStartTime;
	JComboBox rightStartAMPM = new JComboBox(ampm);
	JTextField rightEndTime;
	JComboBox rightEndAMPM = new JComboBox(ampm);
	JLabel rightClassNameLebel;
	JTextField rightClassNameTextField;
	JLabel rightClassDaysLabel;
	JLabel rightClassInfoLebel;
	JTextField rightClassInfoTextField;
	JCheckBox rightMondayCB = new JCheckBox("Monday");
	JCheckBox rightTuesdayCB = new JCheckBox("Tuesday");
	JCheckBox rightWednesdayCB = new JCheckBox("Wednesday");
	JCheckBox rightThursdayCB = new JCheckBox("Thursday");
	JCheckBox rightFridayCB = new JCheckBox("Friday");
	JCheckBox rightSaturdayCB = new JCheckBox("Saturday");
	JButton rightSubmitButton;
	SumbitActionListener submitAction = new SumbitActionListener();

	FileEditor(File inputFile) {
		this.inputFile = inputFile;

		readInFile();

		//////////////////////////////////////////////////
		setLayout(gl);

		createLeftPanel();
		createRightPanel();

		setTitle("File Editor");
		setIconImage(new ImageIcon(this.getClass().getResource("iup_crimson_hawk.jpg")).getImage());
		setSize(width, height);
		setLocationRelativeTo(null);
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		setResizable(false);
		setVisible(true);
	}

	void updateLeftPanel() {
		readInFile();
		remove(leftPanel);
		remove(rightPanel);
		createLeftPanel();
		createRightPanel();
		setVisible(false);
		setVisible(true);
	}

	void createLeftPanel() {
		leftPanel = new JPanel();
		leftPanel.setBackground(backgroundColor);
		leftPanel.setOpaque(true);

		leftScrollPanel = new JPanel();
		GridLayout leftPaneGridLayout = new GridLayout(0, 1);
		leftScrollPanel.setLayout(leftPaneGridLayout);

		JScrollPane scrollPane = new JScrollPane(leftScrollPanel);
		scrollPane.setPreferredSize(new Dimension(width / 2, height - 40));
		leftPanel.add(scrollPane);
		for (int i = 0; i < classList.size(); i++) {
			GridBagLayout gridBag = new GridBagLayout();
			GridBagConstraints c = new GridBagConstraints();
			JPanel card = new JPanel();
			card.setLayout(gridBag);
			card.setBackground(Color.WHITE);
			card.setOpaque(true);
			card.setBorder(BorderFactory.createLineBorder(Color.BLACK));
			c.fill = GridBagConstraints.BOTH;

			c.weightx = 100.0;
			JLabel dcncn = new JLabel(classList.get(i).dcncn);
			gridBag.setConstraints(dcncn, c);
			card.add(dcncn);

			c.weightx = 1.0;
			c.gridwidth = GridBagConstraints.REMAINDER;
			JButton deleteButton = new JButton("X");
			deleteButton.setBackground(Color.RED);
			deleteButton.setOpaque(true);
			DeleteActionListener deleteAction = new DeleteActionListener(i);
			deleteButton.addActionListener(deleteAction);
			gridBag.setConstraints(deleteButton, c);
			card.add(deleteButton);

			c.weightx = 1.0;
			JLabel className = new JLabel(classList.get(i).className);
			gridBag.setConstraints(className, c);
			card.add(className);

			c.weightx = 1.0;
			JLabel time = new JLabel(classList.get(i).time);
			gridBag.setConstraints(time, c);
			card.add(time);

			c.weightx = 1.0;
			c.gridwidth = GridBagConstraints.REMAINDER;
			JLabel days = new JLabel(classList.get(i).days);
			gridBag.setConstraints(days, c);
			card.add(days);

			c.weightx = 1.0;
			Component emptyBox1 = Box.createRigidArea(new Dimension(0, 0));
			gridBag.setConstraints(emptyBox1, c);
			card.add(emptyBox1);

			leftScrollPanel.add(card);

			add(leftPanel);
		}
	}

	void createRightPanel() {
		rightPanel = new JPanel();
		rightPanel.setBackground(backgroundColor);
		rightPanel.setOpaque(true);

		rightPanel.setLayout(new BoxLayout(rightPanel, BoxLayout.Y_AXIS));

		rightTitleLabel = new JLabel("ADD A CLASS");
		rightTitleLabel.setAlignmentX(CENTER_ALIGNMENT);
		rightTitleLabel.setForeground(generalFontColor);
		rightTitleLabel.setOpaque(true);
		rightTitleLabel.setFont(new Font("ariel", Font.BOLD, 20));
		rightTitleLabel.setBackground(backgroundColor);
		rightPanel.add(rightTitleLabel);

		JPanel rightTimePanel = new JPanel();
		rightTimePanel.setBackground(backgroundColor);
		rightTimePanel.setOpaque(true);
		rightTimeLabel = new JLabel("Time: ");
		rightStartTime = new JTextField(8);
		rightEndTime = new JTextField(8);
		rightTimePanel.add(rightTimeLabel);
		rightTimePanel.add(rightStartTime);
		rightTimePanel.add(rightStartAMPM);
		rightTimePanel.add(new JLabel(" - "));
		rightTimePanel.add(rightEndTime);
		rightTimePanel.add(rightEndAMPM);
		rightPanel.add(rightTimePanel);

		JPanel rightClassInfoPanel = new JPanel();
		rightClassInfoPanel.setBackground(backgroundColor);
		rightClassInfoPanel.setOpaque(true);
		rightClassInfoLebel = new JLabel("DEPT CLASS#-SECT#: ");
		rightClassInfoTextField = new JTextField(20);
		rightClassInfoPanel.add(rightClassInfoLebel);
		rightClassInfoPanel.add(rightClassInfoTextField);
		rightPanel.add(rightClassInfoPanel);

		JPanel rightClassNamePanel = new JPanel();
		rightClassNamePanel.setBackground(backgroundColor);
		rightClassNamePanel.setOpaque(true);
		rightClassNameLebel = new JLabel("Class Name: ");
		rightClassNameTextField = new JTextField(20);
		rightClassNamePanel.add(rightClassNameLebel);
		rightClassNamePanel.add(rightClassNameTextField);
		rightPanel.add(rightClassNamePanel);

		JPanel rightClassDaysPanel = new JPanel();
		rightClassDaysPanel.setBackground(backgroundColor);
		rightClassDaysPanel.setOpaque(true);
		rightClassDaysLabel = new JLabel("Class Days: ");
		rightMondayCB.setBackground(backgroundColor);
		rightMondayCB.setForeground(generalFontColor);
		rightMondayCB.setOpaque(true);
		rightTuesdayCB.setBackground(backgroundColor);
		rightTuesdayCB.setForeground(generalFontColor);
		rightTuesdayCB.setOpaque(true);
		rightWednesdayCB.setBackground(backgroundColor);
		rightWednesdayCB.setForeground(generalFontColor);
		rightWednesdayCB.setOpaque(true);
		rightThursdayCB.setBackground(backgroundColor);
		rightThursdayCB.setForeground(generalFontColor);
		rightThursdayCB.setOpaque(true);
		rightFridayCB.setBackground(backgroundColor);
		rightFridayCB.setForeground(generalFontColor);
		rightFridayCB.setOpaque(true);
		rightSaturdayCB.setBackground(backgroundColor);
		rightSaturdayCB.setForeground(generalFontColor);
		rightSaturdayCB.setOpaque(true);
		rightClassDaysPanel.add(rightClassDaysLabel);
		rightClassDaysPanel.add(rightMondayCB);
		rightClassDaysPanel.add(rightTuesdayCB);
		rightClassDaysPanel.add(rightWednesdayCB);
		rightClassDaysPanel.add(rightThursdayCB);
		rightClassDaysPanel.add(rightFridayCB);
		rightClassDaysPanel.add(rightSaturdayCB);
		rightPanel.add(rightClassDaysPanel);

		rightSubmitButton = new JButton("Submit");
		rightSubmitButton.setAlignmentX(CENTER_ALIGNMENT);
		rightSubmitButton.addActionListener(submitAction);
		rightPanel.add(rightSubmitButton);

		add(rightPanel);
	}

	private void readInFile() {

		try {
			Scanner in = new Scanner(this.inputFile);

			classList = new ArrayList<Class>();

			while (in.hasNextLine()) {
				String[] line = in.nextLine().split(",");
				Class c = new Class(line[0], line[1], line[2], line[3]);
				// System.out.println(c);
				classList.add(c);
			}
			Collections.sort(classList);
			in.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

	}

	class SumbitActionListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent arg0) {
			if (filledOut()) {
				writeToInFile(buildStringToWrite());
				clearRightPanel();
			}
		}

		private String buildStringToWrite() {
			StringBuilder sb = new StringBuilder();
			String dcncn = rightClassInfoTextField.getText();
			String className = rightClassNameTextField.getText();
			String time = rightStartTime.getText() + ampm[rightStartAMPM.getSelectedIndex()] + " - "
					+ rightEndTime.getText() + ampm[rightEndAMPM.getSelectedIndex()];

			StringBuilder daysStringBuilder = new StringBuilder();
			if (rightMondayCB.isSelected()) {
				daysStringBuilder.append("M");
			}
			if (rightTuesdayCB.isSelected()) {
				daysStringBuilder.append("T");
			}
			if (rightWednesdayCB.isSelected()) {
				daysStringBuilder.append("W");
			}
			if (rightThursdayCB.isSelected()) {
				daysStringBuilder.append("R");
			}
			if (rightFridayCB.isSelected()) {
				daysStringBuilder.append("F");
			}
			if (rightSaturdayCB.isSelected()) {
				daysStringBuilder.append("S");
			}
			String days = daysStringBuilder.toString();

			sb.append(dcncn + "," + className + "," + time + "," + days);
			// Rebuilds what was already there.
			for (int i = 0; i < classList.size(); i++) {
				sb.append("\n" + classList.get(i).dcncn + "," + classList.get(i).className + "," + classList.get(i).time
						+ "," + classList.get(i).days);
			}
			return sb.toString();
		}

		/**
		 * This will overwrite the input file with new material along with all
		 * of the previous material.
		 */
		private void writeToInFile(String newCSVString) {
			try {
				FileWriter fileWriter = new FileWriter(inputFile, false);
				fileWriter.write(newCSVString);
				fileWriter.close();
				updateLeftPanel();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		private boolean filledOut() {
			if (rightStartTime.getText().equals("")) {
				System.out.println("Failed: No Start Time!");
				return false;
			} else if (rightEndTime.getText().equals("")) {
				System.out.println("Failed: No End Time!");
				return false;
			} else if (rightClassInfoTextField.getText().equals("")) {
				System.out.println("Failed: No Class Info!");
				return false;
			} else if (rightClassNameTextField.getText().equals("")) {
				System.out.println("Failed: No Class Name!");
				return false;
			} else if (!((rightMondayCB.isSelected()) || (rightTuesdayCB.isSelected())
					|| (rightWednesdayCB.isSelected()) || (rightThursdayCB.isSelected()) || (rightFridayCB.isSelected())
					|| (rightSaturdayCB.isSelected()))) {
				System.out.println("Failed: No Days Selected!");
				return false;
			} else {
				System.out.println("Panel Completeness Check is GOOD!");
				return true;
			}
		}

		private void clearRightPanel() {
			rightStartTime.setText("");
			rightStartAMPM.setSelectedIndex(0);
			rightEndTime.setText("");
			rightEndAMPM.setSelectedIndex(0);
			rightClassInfoTextField.setText("");
			rightClassNameTextField.setText("");
			rightMondayCB.setSelected(false);
			rightTuesdayCB.setSelected(false);
			rightWednesdayCB.setSelected(false);
			rightThursdayCB.setSelected(false);
			rightFridayCB.setSelected(false);
			rightSaturdayCB.setSelected(false);
		}
	}

	class DeleteActionListener implements ActionListener {
		int indexNumberOfLineToDelete;

		DeleteActionListener(int indexNumberOfLineToDelete) {
			this.indexNumberOfLineToDelete = indexNumberOfLineToDelete;
		}

		@Override
		public void actionPerformed(ActionEvent arg0) {
			int selectedOption = JOptionPane.showConfirmDialog(null,
					"Are you sure you want to remove " + classList.get(indexNumberOfLineToDelete).className + "?",
					"Choose", JOptionPane.YES_NO_OPTION);
			if (selectedOption == JOptionPane.YES_OPTION) {
				writeToInFile(buildStringToWrite());
			}

		}

		/**
		 * This will read all elements in the classList array list object but
		 * skip the index for for the X button that was clicked
		 * 
		 * @return
		 */
		private String buildStringToWrite() {
			boolean firstLineCreated = false;
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < classList.size(); i++) {
				if (indexNumberOfLineToDelete != i) {
					if (firstLineCreated) {
						sb.append("\n" + classList.get(i).dcncn + "," + classList.get(i).className + ","
								+ classList.get(i).time + "," + classList.get(i).days);
					} else {
						sb.append(classList.get(i).dcncn + "," + classList.get(i).className + ","
								+ classList.get(i).time + "," + classList.get(i).days);
						firstLineCreated = true;
					}
				}
			}
			return sb.toString();
		}

		void writeToInFile(String newCSVString) {
			try {
				FileWriter fileWriter = new FileWriter(inputFile, false);
				fileWriter.write(newCSVString);
				fileWriter.close();
				updateLeftPanel();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

	class Class<T> implements Comparable<T> {
		String dcncn;
		String className;
		String time;
		String days;

		Class(String dcncn, String className, String time, String days) {
			this.dcncn = dcncn;
			this.className = className;
			this.time = time;
			this.days = days;
		}

		public String toString() {
			return dcncn + " " + className + " " + time + " " + days;
		}

		/**
		 * NOT DONE
		 */
		@Override
		public int compareTo(T o2) {

			Class o2class = (Class) o2;

			// Figures out the hour slot
			int o1hours = 0;
			int o2hours = 0;
			try {
				o1hours = Integer.parseInt(this.time.substring(0, 2));
				o2hours = Integer.parseInt(o2class.time.substring(0, 2));
			} catch (Exception e) {
				System.out.println("Incorrect Time Format on atleast one of the CSV files.");
				return 0;
			}

			// Figures out the minutes slot
			int o1minutes = 0;
			int o2minutes = 0;
			try {
				o1minutes = Integer.parseInt(this.time.substring(3, 5));
				o2minutes = Integer.parseInt(o2class.time.substring(3, 5));
			} catch (Exception e) {
				System.out.println("Incorrect Time Format on atleast one of the CSV files.");
				return 0;
			}

			// Figures out the AMPM slot
			String o1AMPM = this.time.substring(5, 7);
			String o2AMPM = o2class.time.substring(5, 7);

			if (o1hours == 12 && o2AMPM.equalsIgnoreCase("PM")) {
				return -1;
			} else if (o2hours == 12 && o1AMPM.equalsIgnoreCase("PM")) {
				return 1;
			}

			// TESTS FOR PM SLOT
			if (o1AMPM.equalsIgnoreCase("AM") && o2AMPM.equalsIgnoreCase("PM")) {
				return -1;
			} else if (o1AMPM.equalsIgnoreCase("PM") && o2AMPM.equalsIgnoreCase("AM")) {
				return 1;
			}

			// TESTS HOURS SLOT
			if (o1hours == o2hours) {

				// TESTS MINUTES SLOT
				if (o1minutes > o2minutes) {
					return 1;
				}
				if (o1minutes < o2minutes) {
					return -1;
				}
				return 0;
			} else if (o1hours > o2hours) {
				return 1;
			} else {
				return -1;
			}
		}

	}

}
